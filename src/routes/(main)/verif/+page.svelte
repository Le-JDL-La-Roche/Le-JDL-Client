<script lang="ts">
  import { invalidateAll } from '$app/navigation'
  import AdminLoginForm from '$components/others/AdminLoginForm.svelte'
  import type { Authorization } from '$models/data/authorization.model'
  import type { Article } from '$models/features/article.model'
  import type { Video } from '$models/features/video.model'
  import type { WebradioShow } from '$models/features/webradio-show.model'
  import ApiArticlesService from '$services/api/api-articles.service'
  import ApiAuthService from '$services/api/api-auth.service'
  import ApiAuthorizationsService from '$services/api/api-authorizations.service'
  import ApiEnvService from '$services/api/api-env.service'
  import ApiVideosService from '$services/api/api-videos.service'
  import ApiWebradioService from '$services/api/api-webradio.service'
  import CookiesService from '$services/cookies.service'
  import { popIn, popOut } from '$services/transitions'
  import utils from '$services/utils'
  import type { PageData } from './$types'

  export let data: PageData

  const apiAuth = new ApiAuthService()
  const cookies = new CookiesService()
  const apiEnv = new ApiEnvService()
  const apiAuthorizations = new ApiAuthorizationsService()
  const apiWebradio = new ApiWebradioService()
  const apiVideos = new ApiVideosService()
  const apiArticles = new ApiArticlesService()

  let button = 'Connexion'
  let error = false

  async function submit(username: string, password: string) {
    button = '...'
    ;(await apiAuth.getAuthMan(username, password)).subscribe({
      next: async (res) => {
        cookies.add({ name: 'JWT_MAN', value: res.body.data?.jwt + '' })
        data.logged = true

        let data_: {
          shows: WebradioShow[]
          videos: Video[]
          articles: Article[]
          authorizations: Authorization[]
        } = {
          shows: [],
          videos: [],
          articles: [],
          authorizations: []
        }
        ;(await apiWebradio.getAllShows()).subscribe({
          next: (res) => {
            data_.shows = res.body.data?.shows || []
          }
        })
        ;(await apiVideos.getAllVideos()).subscribe({
          next: (res) => {
            data_.videos = res.body.data?.videos || []
          }
        })
        ;(await apiArticles.getAllArticles()).subscribe({
          next: (res) => {
            data_.articles = res.body.data?.articles || []
          }
        })
        ;(await apiAuthorizations.getAuthorizations()).subscribe({
          next: (res) => {
            data_.authorizations = res.body.data?.authorizations || []
          }
        })
        data.data = data_
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

  function logout() {
    cookies.delete('JWT_MAN')
    invalidateAll()
  }
</script>

<svelte:head>
  <title>{data.logged ? 'Gestion des autorisation' : 'Connexion responsable'} • Le JDL - La Roche</title>
</svelte:head>

{#if !data.logged || !data.data}
  <div out:popOut in:popIn style="padding: 0.02px 0">
    <AdminLoginForm bind:button bind:error {submit} title="Connexion responsable" />
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
