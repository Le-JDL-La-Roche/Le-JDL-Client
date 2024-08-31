<script lang="ts">
  import type { PageData } from './$types'
  import ApiAuthService from '$services/api/api-auth.service'
  import AdminLoginForm from '$components/others/AdminLoginForm.svelte'
  import { popIn, popOut } from '$services/transitions'
  import { invalidateAll } from '$app/navigation'
  import CookiesService from '$services/cookies.service'
  import ApiEnvService from '$services/api/api-env.service'
  import utils from '$services/utils'

  export let data: PageData

  const apiAuth = new ApiAuthService()
  const cookies = new CookiesService()
  const apiEnv = new ApiEnvService()

  let button = 'Connexion'
  let error = false

  async function submit(username: string, password: string) {
    button = '...'
    ;(await apiAuth.getAuth(username, password)).subscribe({
      next: async (res) => {
        cookies.delete('JWT_MAN')
        cookies.add({ name: 'JWT', value: res.body.data?.jwt + '' })
        if (sessionStorage.getItem('VISITED') && sessionStorage.getItem('VISITED') !== 'admin') {
          ;(await apiEnv.deleteAdminVisits(+sessionStorage.getItem('VISITED')!)).subscribe({
            next: () => {
              sessionStorage.setItem('VISITED', 'admin')
            }
          })
        } else {
          sessionStorage.setItem('VISITED', 'admin')
        }

        data.logged = true
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
    <AdminLoginForm bind:button bind:error {submit} />
  </div>
{:else}
  <div in:popIn out:popOut style="padding: 0.02px 0">
    <button class="logout" on:click={logout}><i class="fa-solid fa-right-from-bracket" />&nbsp;&nbsp;Déconnexion</button>
    <h2 style="margin-top: 10px">Espace administration</h2>

    <a class="not-a" href="/admin/emissions">
      <button class="primary"> <i class="fa-solid fa-microphone" />&nbsp;&nbsp;Gérer les émissions</button>
    </a>
    <a class="not-a" href="/admin/videos">
      <button class="primary"><i class="fa-solid fa-video" />&nbsp;&nbsp;Gérer les vidéos</button>
    </a>
    <a class="not-a" href="/admin/articles">
      <button class="primary"><i class="fa-solid fa-file" />&nbsp;&nbsp;Gérer les articles</button>
    </a>
    <a class="not-a" href="/admin/journalistes">
      <button class="primary"><i class="fa-solid fa-user" />&nbsp;&nbsp;Gérer les journalistes</button>
    </a>
    <a class="not-a" href="/admin/agenda">
      <button class="primary"><i class="fa-solid fa-calendar" />&nbsp;&nbsp;Gérer l'agenda</button>
    </a>
    <a class="not-a" href="/admin/infos">
      <button class="primary"><i class="fa-solid fa-exclamation-triangle" />&nbsp;&nbsp;Gérer les informations</button>
    </a>
    <a class="not-a" href="/admin/stats">
      <button class="primary"><i class="fa-solid fa-circle-info" />&nbsp;&nbsp;Statistiques du site</button>
    </a>
  </div>
{/if}

<style lang="scss">
  button.logout {
    position: relative;
    width: auto;
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
