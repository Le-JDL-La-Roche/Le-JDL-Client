<script lang="ts">
  import ApiAuthService from '$services/api/api-auth.service'
  import CookiesService from '$services/cookies.service'
  import utils from '$services/utils'

  export let logged: boolean

  const apiAuth = new ApiAuthService()
  const cookies = new CookiesService()

  let username: string
  let password: string
  let error = false

  let button = 'Connexion'

  async function submit() {
    button = '...'
    ;(await apiAuth.getAuth(username, password)).subscribe({
      next: (res) => {
        cookies.add({ name: 'JWT', value: res.body.data?.jwt + '' })
        logged = true
      },
      error: async (resp) => {
        button = 'Connexion'
        error = true
        password = ''
        await utils.sleep(600)
        error = false
      }
    })
  }
</script>

<form on:submit|preventDefault={submit} class:error>
  <h3>Connexion administrateur</h3>
  <!-- svelte-ignore a11y-autofocus -->
  <input type="text" placeholder="Nom d'utilisateur" autocapitalize="off" autofocus bind:value={username} required />
  <input type="password" placeholder="Mot de passe" bind:value={password} required />
  <button type="submit" class="primary" id="login-button">{button}</button>
</form>

<style lang="scss">
  form {
    width: 250px;
    padding: 30px;
    border-radius: 5px;
    box-shadow: 0 0 30px rgba(100, 100, 100, 0.05);
    border: 1px solid var(--light-gray-color);
    margin: 32px auto 25px auto;
    transition: all 0.1s;
    &.error {
      animation-name: error-jerk;
      animation-duration: 0.5s;
    }
  }

  @keyframes error-jerk {
    0% {
      transform: translateX(0);
    }

    20% {
      transform: translateX(10px);
    }

    40% {
      transform: translateX(-10px);
    }

    60% {
      transform: translateX(10px);
    }

    80% {
      transform: translateX(-10px);
    }

    100% {
      transform: translateX(0);
    }
  }
</style>
