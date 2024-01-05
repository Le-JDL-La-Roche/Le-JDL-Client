<script lang="ts">
  import { goto } from '$app/navigation'
  import type { PageData } from './$types'
  import ApiWebradioService from '$services/api/api-webradio.service'
  import io from '$services/api/socket.service'
  import ContentService from '$services/content.service'
  import utils from '$services/utils'
  import { onMount } from 'svelte'
  import type { WebradioShow } from '$models/features/webradio-show.model'

  export let data: PageData

  const apiWebradio = new ApiWebradioService()
  const content = new ContentService()

  let fontSize: number
  let speed: number
  let mode = 0
  let prompt = -1
  let reverse = false

  let windowWidth = window.innerWidth
  let realSpeed: number

  let countdown = 0
  let countdownInterval: NodeJS.Timeout

  let s = 0
  let t = 1
  let scroll: NodeJS.Timeout

  onMount(() => {
    fontSize = 64
    speed = 50
    mode = 0
    reverse = false

    io.emit('resetPrompterSettings')
  })

  io.on('showUpdated', async () => {
    ;(await apiWebradio.getCurrentShow()).subscribe({
      next: (res) => {
        data.show = res.body.data?.show as WebradioShow
      }
    })
  })

  // Paramètres - Vitesse de défilement du prompteur, relative à la largeur de la fenêtre et à la taille du texte, en px/s
  // Paramètres - Lecture/Pause du prompteur
  // Paramètres - Partie suivante/précédente (i+1/i-1)
  io.on('prompterSettingsUpdated', (settings) => {
    fontSize = settings.fontSize
    speed = settings.speed
    mode = settings.mode
    reverse = settings.reverse

    if (mode !== 0) {
      if (settings.addPrompt && data.show) {
        if (settings.addPrompt === -1 && s > realSpeed) {
          stopScroll()
          const div = document.getElementById(`prompt-${prompt}`)!
          div.style.display = 'block'
          div.style.transition = `transform 0s linear`
          div.style.transform = `translateY(calc(50vh + 20px))`
          if (mode === 1) {
            startScroll()
          }
        } else if (
          (settings.addPrompt === 1 && prompt < JSON.parse(data.show.prompter + '').length - 1) ||
          (settings.addPrompt === -1 && prompt > 0)
        ) {
          stopScroll()
          prompt += settings.addPrompt
          const div = document.getElementById(`prompt-${prompt}`)!
          div.style.display = 'block'
          div.style.transition = `transform 0s linear`
          div.style.transform = `translateY(calc(50vh + 20px))`
          if (mode === 1) {
            startScroll()
          }
        } else {
          stopScroll()
          prompt = -1
        }
      }
    }

    if (settings.addLine && data.show) {
      const div = document.getElementById(`prompt-${prompt}`)!
      if (
        div &&
        s + ((settings.addLine * 4) / 3) * fontSize * 1.8 > -4/3 * fontSize * 1.8 &&
        s + ((settings.addLine * 4) / 3) * fontSize * 1.8 < div.offsetHeight + window.innerHeight / 4
      ) {
        s += ((settings.addLine * 4) / 3) * fontSize * 1.8
        let tr = div.style.transform
        div.style.transition = `transform ${t/4}s linear`
        div.style.transform = `translateY(calc(50vh + 20px - ${s}px))`
        div.style.transition = tr
      }
    }

    if (mode === 1) {
      startScroll()
    } else if (mode === 2) {
      pauseScroll()
    }
  })

  // OBS - Quand la scène passe sur le jingle => Décompte de 10 sec -> Prompteur à l'introduction (partie i=0)
  // OBS - Quand la scène passe sur l'inter-jingle => Décompte de 3 secondes -> Prompteur à la partie suivante (partie i+1)
  io.on('sceneUpdated', (scene: string) => {
    if (mode === 0) {
      if (scene === '🎬 Jingle') {
        stopScroll()
        prompt = 0
        const div = document.getElementById(`prompt-${prompt}`)!
        div.style.transition = `transform 0s linear`
        div.style.transform = `translateY(calc(50vh + 20px))`
        if (countdownInterval) clearInterval(countdownInterval)
        countdown = 10
        countdownInterval = setInterval(() => {
          countdown--
          if (countdown === 0) {
            clearInterval(countdownInterval)
            startScroll()
          }
        }, 975)
      } else if (scene === '🎬 Inter-jingle' && data.show && prompt < JSON.parse(data.show.prompter + '').length - 1) {
        prompt++
        stopScroll()
        const div = document.getElementById(`prompt-${prompt}`)!
        div.style.transition = `transform 0s linear`
        div.style.transform = `translateY(calc(50vh + 20px))`
        if (countdownInterval) clearInterval(countdownInterval)
        countdown = 3
        countdownInterval = setInterval(() => {
          countdown--
          if (countdown === 0) {
            clearInterval(countdownInterval)
            startScroll()
            console.log('start')
          }
        }, 1000)
      } else if (scene === '🛑 Fin') {
        prompt = -1
        const div = document.getElementById(`prompt-0`)
        if (div) div.style.display = `none`
        else console.log('oops')
        stopScroll()
      }
    }
  })

  // Calculer en permanence le nombre de ligne de chaque prompt, stocker dans un tableau
  $: if (fontSize) {
    if (data.show) {
      for (let i = 0; i < JSON.parse(data.show.prompter + '').length; i++) {
        const div = document.getElementById(`prompt-${i}`)!
        div.style.fontSize = `${fontSize}pt`
      }
    }
  }

  // Calculer en permanence la vitesse de défilement du prompteur, en px/s
  $: if (speed && windowWidth && fontSize) {
    realSpeed = Math.round((1500 * fontSize) / windowWidth + 4.5 * speed - 150)
  }

  function startScroll() {
    if (scroll) clearInterval(scroll)
    if (data.show) {
      for (let i = 0; i < JSON.parse(data.show.prompter + '').length; i++) {
        const div = document.getElementById(`prompt-${i}`)
        if (div && prompt !== i) div.style.display = `none`
      }
    }
    scroll = setInterval(() => {
      const div = document.getElementById(`prompt-${prompt}`)
      if (prompt !== -1 && div) {
        div.style.display = `block`
        div.style.transition = `transform ${t / 4}s linear`
        if (s > div.offsetHeight + window.innerHeight / 4) {
          pauseScroll()
        } else {
          s += realSpeed / 4
          div.style.transform = `translateY(calc(50vh + 20px - ${s}px))`
        }
      }
      s++
    }, t * 250)
  }

  function pauseScroll() {
    clearInterval(scroll)
  }

  function stopScroll() {
    clearInterval(scroll)
    if (data.show) {
      for (let i = 0; i < JSON.parse(data.show.prompter + '').length; i++) {
        const div = document.getElementById(`prompt-${i}`)
        console.log(div)
        if (div) div.style.display = `none`
        else console.log('oops')
      }
    }
    s = 0
  }
</script>

<svelte:head>
  <title>Prompteur • Le JDL - La Roche</title>
</svelte:head>

<svelte:window on:resize={() => (windowWidth = window.innerWidth)} />

{#if data.show}
  <div class="main" style={`transform: scaleY(${reverse ? '-1' : '1'})`}>
    <a href="/admin/emissions" class="not-a" on:click={stopScroll}>
      <button class="secondary"><i class="fa-solid fa-caret-left" /></button>
    </a>
    <div class="prompter">
      <i class="fa-solid fa-chevron-right mark" />
      {#if countdown}
        <p class="countdown">
          <span style="font-weight: bold">{countdown}</span><br />
          <span class="title">{JSON.parse(data.show.prompter + '')[prompt].title}</span>
        </p>
      {/if}
      {#each JSON.parse(data.show.prompter + '') as prompter, i}
        <p class="prompt" id={`prompt-${i}`}>
          {@html content.markdownToHtml(prompter.content)}
        </p>
      {/each}
    </div>
  </div>
{:else}
  <div class="main">
    <div class="header">
      <a href="/admin/emissions" class="not-a">
        <button class="secondary"><i class="fa-solid fa-caret-left" /></button>
      </a>
      <h2>Aucun direct en cours</h2>
    </div>
  </div>
{/if}

<style lang="scss">
  div.main {
    background: black;
    min-height: 100vh;
  }

  button.secondary {
    width: auto;
    margin: 0;
    background: black;
    color: white;
    font-size: 24px;
    padding: 15px 20px;
    border-radius: 0;
    position: absolute;
    z-index: 100;

    &:hover {
      background: #151515;

      &:active {
        background: #202020;
      }
    }
  }

  h2 {
    color: white;
    margin: 0;
    font-size: 36px;
    font-family: Arial, Helvetica, sans-serif !important;
  }

  h3 {
    color: white;
    margin: 0 0 5px 0;
    font-size: 24px;
    font-family: Arial, Helvetica, sans-serif !important;
  }

  div.prompter {
    padding: 0 70px 0 90px;
    position: relative;
    height: 100vh;
    overflow-y: hidden;

    i.mark {
      position: fixed;
      left: 25px;
      font-size: 50px;
      top: calc(50% - 20px);
      color: #70ff70;
    }
  }

  p.prompt {
    color: white;
    font-family: Arial, Helvetica, sans-serif !important;
    margin: 0;
    line-height: 1.8;
    word-spacing: 5px;
    display: none;
  }

  p.countdown {
    color: white;
    font-family: Arial, Helvetica, sans-serif !important;
    margin: 0;
    line-height: 1.2;
    word-spacing: 5px;
    font-size: 100px;
    text-align: center;
    position: fixed;
    top: calc(50% - 150px);
    left: 0;
    width: 100%;
    z-index: 1000;

    span.title {
      font-size: 64px;
    }
  }
</style>
