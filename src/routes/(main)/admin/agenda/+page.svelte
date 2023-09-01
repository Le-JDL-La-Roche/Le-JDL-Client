<script lang="ts">
  import ApiAgendaService from '$services/api/api-agenda.service'
  import type { PageData } from './$types'
  import type { Event } from '$models/features/agenda.model'
  import { api } from '$services/store'
  import AddEditEventModal from '$components/modals/AddEditEventModal.svelte';

  export let data: PageData

  const apiAgenda = new ApiAgendaService()

  let showAddEditModal = false
  let action: { action: 'add' } | { action: 'edit'; element: Event }

  function getCurrentDay(date: number) {
    return new Date(date * 1000).toLocaleString('en-US', { weekday: 'short' }).toLowerCase() as
      | 'mon'
      | 'tue'
      | 'wed'
      | 'thu'
      | 'fri'
      | 'sat'
      | 'sun'
  }

  function getCurrentNo(date: number) {
    return new Date(date * 1000).toLocaleString('en-US', { day: '2-digit' })
  }

  function getCurrentMonth(date: number) {
    return new Date(date * 1000).toLocaleString('en-US', { month: 'short' }).toLowerCase() as
      | 'jan'
      | 'feb'
      | 'mar'
      | 'apr'
      | 'may'
      | 'jun'
      | 'jul'
      | 'aug'
      | 'sep'
      | 'oct'
      | 'nov'
      | 'dec'
  }

  const day = {
    mon: 'Lundi',
    tue: 'Mardi',
    wed: 'Mercredi',
    thu: 'Jeudi',
    fri: 'Vendredi',
    sat: 'Samedi',
    sun: 'Dimanche'
  }

  const month = {
    jan: 'Janvier',
    feb: 'Février',
    mar: 'Mars',
    apr: 'Avril',
    may: 'Mai',
    jun: 'Juin',
    jul: 'Juillet',
    aug: 'Août',
    sep: 'Septem.',
    oct: 'Octobre',
    nov: 'Novemb.',
    dec: 'Décemb.'
  }

  async function deleteEvent(element: Event) {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'évènement "${element.title}" ?`)) {
      return
    }
    ;(await apiAgenda.deleteEvent(element.id || 0)).subscribe({
      next: (res) => {
        data.data = res.body.data?.agenda || []
      },
      error: () => {}
    })
  }
</script>

<svelte:head>
  <title>Agenda - Administration • Le JDL - La Roche</title>
</svelte:head>

<h2>
  <a href="/admin">Espace administration</a>&nbsp;&nbsp;<i class="fa-solid fa-caret-right" />&nbsp; Gérer l'agenda
</h2>

<button
  class="primary"
  style="margin-bottom: 30px"
  on:click={() => {
    action = { action: 'add' }
    showAddEditModal = true
  }}
>
  <i class="fa-solid fa-plus" />&nbsp;&nbsp;Ajouter un évènement
</button>

<div class="container">
  {#each data.data || [] as event}
    <div class="element">
      <div class="left">
        <div class="date">
          <div class="after" style={'background-color: ' + event.color} />
          <span
            class="day"
            class:mon={getCurrentDay(+event.date) === 'mon'}
            class:tue={getCurrentDay(+event.date) === 'tue'}
            class:wed={getCurrentDay(+event.date) === 'wed'}
            class:thu={getCurrentDay(+event.date) === 'thu'}
            class:fri={getCurrentDay(+event.date) === 'fri'}
            class:sat={getCurrentDay(+event.date) === 'sat'}
            class:sun={getCurrentDay(+event.date) === 'sun'}>{day[getCurrentDay(+event.date)]}</span
          >
          <span class="no">{getCurrentNo(+event.date)}</span>
          <span
            class="month"
            class:jan={getCurrentMonth(+event.date) === 'jan'}
            class:feb={getCurrentMonth(+event.date) === 'feb'}
            class:mar={getCurrentMonth(+event.date) === 'mar'}
            class:apr={getCurrentMonth(+event.date) === 'apr'}
            class:may={getCurrentMonth(+event.date) === 'may'}
            class:jun={getCurrentMonth(+event.date) === 'jun'}
            class:jul={getCurrentMonth(+event.date) === 'jul'}
            class:aug={getCurrentMonth(+event.date) === 'aug'}
            class:sep={getCurrentMonth(+event.date) === 'sep'}
            class:oct={getCurrentMonth(+event.date) === 'oct'}
            class:nov={getCurrentMonth(+event.date) === 'nov'}
            class:dec={getCurrentMonth(+event.date) === 'dec'}>{month[getCurrentMonth(+event.date)]}</span
          >
        </div>
        <div class="event-content">
          <p class="title">{event.title}</p>
          <p class="content">{event.content}</p>
        </div>
        <img src={`${api}/public/images/thumbnails/${event.thumbnail}`} alt="Évènement" />
      </div>
      <div class="actions">
        <div class="edit">
          <button
            class="secondary"
            on:click={() => {
              showAddEditModal = true
              action = { action: 'edit', element: event }
            }}
          >
            <i class="fa-solid fa-pencil" />
          </button>
          <button class="secondary" on:click={() => deleteEvent(event)}><i class="fa-solid fa-trash" /></button>
        </div>
      </div>
    </div>
  {:else}
    Aucun évènement
  {/each}
</div>

<AddEditEventModal bind:show={showAddEditModal} {action} bind:data />

<style lang="scss">
  div.element {
    display: flex;
    flex-direction: column;
    border: 1px solid var(--mid-gray-color);
    padding: 30px;
    min-height: 100px;
    border-radius: 5px;
    margin-bottom: 20px;
    gap: 30px;

    div.left {
      display: flex;
      flex-direction: row;
      flex: 1;
    }
  }

  div.date {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    padding-right: 30px;
    position: relative;

    div.after {
      content: '';
      position: absolute;
      width: 8px;
      border-radius: 50rem;
      height: calc(100% + 10px);
      right: -4px;
      top: -5px;
    }

    span {
      font-weight: bold;
      display: block;
      line-height: 1;
      font-family: 'Chivo Mono', monospace;
    }

    span.day {
      &.mon,
      &.tue,
      &.thu {
        font-size: 22px;
      }

      &.sat {
        font-size: 18.5px;
      }

      &.wed,
      &.fri,
      &.sun {
        font-size: 14px;
      }
    }

    span.no {
      font-size: 55px;
    }

    span.month {
      &.jan,
      &.feb,
      &.jul,
      &.sep,
      &.oct,
      &.nov,
      &.dec {
        font-size: 16px;
      }

      &.mar,
      &.may,
      &.apr,
      &.jun,
      &.aug {
        font-size: 18px;
      }
    }
  }

  div.event-content {
    padding-left: 30px;
    flex: 1;

    p.title {
      font-size: 18px;
      margin-top: 0;
      font-weight: bold;
    }
  }

  img {
    display: none;
    margin-left: 30px;
    height: 100px;
    border-radius: 5px;
  }

  div.hr {
    height: 0;
    margin: 35px 0;
    border: 1px solid var(--mid-gray-color);
    position: relative;

    &:before {
      content: 'Anciens évènements';
      color: var(--dark-gray-color);
      position: relative;
      text-align: center;
      width: 170px;
      display: block;
      top: -10px;
      margin: 0 auto;
      background: white;
    }
  }

  div.actions {
    display: flex;
    flex-direction: row;
    gap: 15px;

    div.edit {
      display: flex;
      flex-direction: row;
      gap: 15px;

      button.secondary {
        margin: 0;
        width: 31px;
        height: 31px;
      }

      i.fa-solid {
        display: inline-block;
        margin-right: 10px;
      }
    }
  }

  @media screen and (min-width: 850px) {
    div.element {
      flex-direction: row;
    }
    img {
      display: block;
    }

    div.actions {
      text-align: right;
      flex-direction: column;
    }
  }
</style>
