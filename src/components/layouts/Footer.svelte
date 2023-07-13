<script lang="ts">
  import { showAcceptCookies$ } from '$services/store'
</script>

<footer>
  <div class="content">
    <p style="width: 100%; text-align: center; margin-bottom: 25px; font-size: 18px;">
      <strong>Rejoignez-nous !</strong>
      <a class="social" href="https://podcast.ausha.co/ecouter-la-roche" target="_blank">
        <i class="fa-solid fa-podcast" />
      </a>
      <a class="social" href="https://www.youtube.com/channel/UCs3H_WZJogy8GnmrMNXjyPA" target="_blank">
        <i class="fa-brands fa-youtube" />
      </a>
      <a class="social" href="https://instagram.com/lejdl.laroche" target="_blank">
        <i class="fa-brands fa-instagram" />
      </a>
    </p>

    <div class="flex">
      <div class="in-flex">
        <img src="/assets/images/v2/logo.png" alt="Logo Le JDL" />
        <p>Journal du Lycée La Rochefoucauld</p>
        <p>Mail : <a href="mailto:lejdl@laroche.org">lejdl@laroche.org</a></p>
      </div>

      <div class="in-flex">
        <img src="/assets/images/logo_la_roche.png" alt="Logo La Rochefoucauld" />
        <p>
          Le JDL est lié au
          <a href="https://laroche.org/" target="_blank"
            >Lycée La Rochefoucauld
            <i class="fa-solid fa-arrow-up-right-from-square" style="font-size: 12px" /></a
          >
          et est ainsi soumis à son règlement intérieur.
        </p>
      </div>
    </div>

    <div class="utils">
      <p>
        <button class="secondary" style="margin: 0; width: auto" on:click={() => showAcceptCookies$.set(true)}
          ><i class="fa-solid fa-cookie" />&nbsp;&nbsp;Gérer les cookies</button
        >
      </p>
      <p>
        <a href="https://github.com/Le-JDL-La-Roche/Le-JDL-Client/blob/main/README.md#a-propos-du-blog" target="_blank">
          A propos du Blog
        </a>
      </p>
      <p>
        <a href="https://github.com/Le-JDL-La-Roche/Le-JDL-Client/blob/main/CHANGESLOG.md#mises-à-jour-du-blog" target="_blank">
          Mises à jour du Blog
        </a>
      </p>
      <p>
        <a href="https://github.com/Le-JDL-La-Roche/Le-JDL-API/blob/main/README.md#a-propos-de-lapi" target="_blank">
          A propos de l'API
        </a>
      </p>
      <p>
        <a href="https://github.com/Le-JDL-La-Roche/Le-JDL-API/blob/main/CHANGESLOG.md#mises-à-jour-de-lapi" target="_blank">
          Mises à jour de l'API
        </a>
      </p>
    </div>
  </div>

  <a href="/admin" class="admin">Admin</a>
</footer>

<style lang="scss">
  footer {
    background-color: var(--background-light-color);
    padding: 20px 0 20px 0;
    margin-top: 70px;
    position: relative;
  }

  div.flex {
    display: flex;
    gap: 25px;
    margin-bottom: 25px;

    div.in-flex {
      flex: 1;
      vertical-align: top;

      img,
      p {
        vertical-align: top;
        margin: 0 auto;
      }

      img {
        float: left;
        margin-right: 25px;
        height: 50px;
      }
    }
  }

  .social {
    display: inline-block;
    margin-left: 15px;
    border: none !important;

    &:hover {
      border: none !important;
    }
  }

  div.utils {
    display: flex;
    font-size: 14px;
    width: 100%;
    flex-direction: row;
    align-items: center;

    p {
      flex: 1;
    }
  }

  a.admin {
    position: absolute;
    right: 5px;
    bottom: 5px;
    color: var(--background-light-color);
  }

  @media screen and (max-width: 850px) {
    footer {
      text-align: center;
    }

    div.flex {
      flex-direction: column;
      img {
        float: none !important;
        margin: 0 auto 15px auto !important;
        display: block !important;
      }
    }

    div.utils {
      display: block;

      p {
        margin: 0;
        padding-bottom: 10px;
      }
    }
  }
</style>
