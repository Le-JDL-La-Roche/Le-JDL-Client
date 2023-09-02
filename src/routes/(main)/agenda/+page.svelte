<script lang="ts">
  import type { Event } from '$models/features/agenda.model'
  import ContentService from '$services/content.service'
  import { api } from '$services/store'
  import { onMount } from 'svelte'
  import type { PageData } from './$types'

  export let data: PageData

  const content = new ContentService()

  let futureEvents: Event[] = []
  while (data.agenda[0] && +data.agenda[0].date > Math.round(new Date().getTime() / 1000)) {
    futureEvents.push(data.agenda[0])
    data.agenda.shift()
  }

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
</script>

<svelte:head>
  <title>Agenda • Le JDL - La Roche</title>
</svelte:head>

<h2>Agenda</h2>

{#each futureEvents as event}
  <div class="event">
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
      <p class="content">{@html content.markdownToHtml(event.content)}</p>
    </div>
    <img src={`${api}/public/images/thumbnails/${event.thumbnail}`} alt="Évènement" />
  </div>
{:else}
  <p style="text-align: center">Aucun évènement à venir</p>
{/each}

<div class="hr" />

{#each data.agenda as event}
  <div class="event past">
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
      <p class="content">{@html content.markdownToHtml(event.content)}</p>
    </div>
    <img src={`${api}/public/images/thumbnails/${event.thumbnail}`} alt="Évènement" />
  </div>
{:else}
  <p style="text-align: center">Aucun évènement passé</p>
{/each}

<style lang="scss">
  div.event {
    display: flex;
    flex-direction: row;
    padding: 30px;
    border-radius: 5px;
    border: 1px solid var(--mid-gray-color);
    min-height: 100px;
    margin-bottom: 20px;

    &.past {
      opacity: 0.5;
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

  @media screen and (min-width: 850px) {
    img {
      display: block;
    }
  }
</style>
