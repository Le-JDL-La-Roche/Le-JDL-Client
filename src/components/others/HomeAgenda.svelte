<script lang="ts">
  import type { Event } from '$models/features/agenda.model'
  import ContentService from '$services/content.service'
  import { api } from '$services/store'
  import { onMount } from 'svelte'

  export let agenda: Event[]

  const content = new ContentService()

  let event = false

  let i = 0
  while (agenda[i] && +agenda[i].date > Math.round(new Date().getTime() / 1000)) {
    console.log(agenda[i].date)
    event = true
    i++
  }

  i -= 1

  const cday = new Date(+agenda[i].date * 1000).toLocaleString('en-US', { weekday: 'short' }).toLowerCase() as
    | 'mon'
    | 'tue'
    | 'wed'
    | 'thu'
    | 'fri'
    | 'sat'
    | 'sun'
  const cno = new Date(+agenda[i].date * 1000).toLocaleString('en-US', { day: '2-digit' })
  const cmonth = new Date(+agenda[i].date * 1000).toLocaleString('en-US', { month: 'short' }).toLowerCase() as
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

{#if event}
  <div class="event">
    <div class="date">
      <div class="after" style={'background-color: ' + agenda[i].color} />
      <span
        class="day"
        class:mon={cday === 'mon'}
        class:tue={cday === 'tue'}
        class:wed={cday === 'wed'}
        class:thu={cday === 'thu'}
        class:fri={cday === 'fri'}
        class:sat={cday === 'sat'}
        class:sun={cday === 'sun'}>{day[cday]}</span
      >
      <span class="no">{cno}</span>
      <span
        class="month"
        class:jan={cmonth === 'jan'}
        class:feb={cmonth === 'feb'}
        class:mar={cmonth === 'mar'}
        class:apr={cmonth === 'apr'}
        class:may={cmonth === 'may'}
        class:jun={cmonth === 'jun'}
        class:jul={cmonth === 'jul'}
        class:aug={cmonth === 'aug'}
        class:sep={cmonth === 'sep'}
        class:oct={cmonth === 'oct'}
        class:nov={cmonth === 'nov'}
        class:dec={cmonth === 'dec'}>{month[cmonth]}</span
      >
    </div>
    <div class="event-content">
      <p class="title">{agenda[i].title}</p>
      <p class="content">{@html content.markdownToHtml(agenda[i].content)}</p>
      <a class="more" href="/agenda">Plus d'infos ...</a>
    </div>
    <img src={`${api}/public/images/thumbnails/${agenda[i].thumbnail}`} alt="Évènement" />
  </div>
{:else}
  <div class="event" style="display: block">
    <p style="text-align: center">Aucun évènement à venir</p>
  </div>
{/if}

<a href="/agenda" class="not-a">
  <button class="secondary">Voir plus&nbsp;&nbsp;<i class="fa-solid fa-caret-right" /></button>
</a>

<style lang="scss">
  div.event {
    display: flex;
    flex-direction: row;
    padding: 30px;
    border-radius: 5px;
    border: 1px solid var(--mid-gray-color);
    height: 100px;
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
      display: -webkit-box;
      -webkit-box-orient: vertical;
      text-overflow: ellipsis;
      max-height: 60px;
      line-clamp: 2;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }

    p.content {
      display: none;
      -webkit-box-orient: vertical;
      text-overflow: ellipsis;
      max-height: 60px;
      line-clamp: 2;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
  }

  img {
    display: none;
    margin-left: 30px;
    height: 100px;
  }

  // @media screen and (min-width: 850px) {
  //   p.title {
  //     max-height: 29px;
  //     line-clamp: 1;
  //     -webkit-line-clamp: 1;
  //   }

  //   p.content {
  //     display: -webkit-box !important;
  //   }

  //   a.more {
  //     display: none;
  //   }

  //   img {
  //     display: block;
  //   }
  // }
</style>
