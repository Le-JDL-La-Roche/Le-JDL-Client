<script lang="ts">
  import type { PageData } from './$types'
  import ApiAuthService from '$services/api/api-auth.service'
  import AdminLoginForm from '$components/others/AdminLoginForm.svelte'
  import { scale } from 'svelte/transition'
  import { popIn, popOut } from '$services/transitions'
  import { invalidateAll } from '$app/navigation'
  import CookiesService from '$services/cookies.service'

  export let data: PageData

  const apiAuth = new ApiAuthService()
  const cookies = new CookiesService()

  async function logout() {
    ;(await apiAuth.deleteLogout()).subscribe({
      finally: () => {
        cookies.delete('JWT')
        invalidateAll()
      }
    })
  }
</script>

<svelte:head>
  <title>{data.logged ? 'Administration' : 'Connexion administrateur'} • Le JDL - La Roche</title>
</svelte:head>

{#if !data.logged}
  <div out:popOut in:popIn style="padding: 0.02px 0">
    <AdminLoginForm bind:logged={data.logged} />
  </div>
{:else}
  <div in:popIn out:popOut style="padding: 0.02px 0">
    <button class="logout" on:click={logout}><i class="fa-solid fa-right-from-bracket" />&nbsp;&nbsp;Déconnexion</button>
    <h2 style="margin-top: 10px">Espace administration</h2>
    
    <a class="not-a" href="/admin/emissions">
      <button class="primary"> <i class="fa-solid fa-microphone" />&nbsp;&nbsp;Emissions de radio et podcasts</button>
    </a>
    <a class="not-a" href="/admin/videos">
      <button class="primary"><i class="fa-solid fa-video" />&nbsp;&nbsp;Gérer les vidéos</button>
    </a>
    <a class="not-a" href="/admin/articles">
      <button class="primary"><i class="fa-solid fa-file" />&nbsp;&nbsp;Gérer les articles</button>
    </a>
    <a class="not-a" href="/admin/infos">
      <button class="primary"><i class="fa-solid fa-circle-info" />&nbsp;&nbsp;Informations sur le Blog </button>
    </a>
  </div>
{/if}

<style lang="scss">
  button.logout {
    position: relative;
    width: auto;
    top: -5px;
    z-index: 10;
    padding: 10px;
    border-radius: 3px;
    border: none;
    background-color: #fadede;
    float: right;
    display: block;
    outline: none;
    transition: all 0.3s;
    cursor: pointer;
    color: black;

    &:hover {
      background-color: #f5c0c0;

      &:active {
        background-color: #ffe5e5;
        color: black;
      }
    }
  }
</style>
