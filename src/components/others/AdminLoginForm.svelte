<script lang="ts">
  import ApiAuthService from '$services/api/api-auth.service'
  import ApiEnvService from '$services/api/api-env.service'
  import CookiesService from '$services/cookies.service'
  import utils from '$services/utils'

  export let title = 'Connexion administrateur'
  export let submit: (username: string, password: string) => Promise<void>
  export let button = 'Connexion'
  export let error = false

  let username: string
  let password: string
</script>

<form on:submit|preventDefault={() => submit(username, password)} class:error>
  <h3>{title}</h3>
  <label for="username">Identifiant</label>
  <!-- svelte-ignore a11y-autofocus -->
  <input type="text" autocapitalize="off" autofocus bind:value={username} required id="username" />

  <label for="password" id="password">Mot de passe</label>
  <input type="password" bind:value={password} required />

  <button type="submit" class="primary">{button}</button>
</form>

<style lang="scss">
  form {
    width: 250px;
    padding: 30px;
    border-radius: 5px;
    box-shadow: 0 0 30px rgba(100, 100, 100, 0.05);
    border: 1px solid var(--light-gray-color);
    margin: 92px auto;
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
