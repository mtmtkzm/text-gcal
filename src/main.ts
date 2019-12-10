import * as delegate from 'delegate';
import * as ClipboardJS from 'clipboard';

const main = () => {
  delegate(`[data-eventchip]`, `click`, () => {
    setTimeout(() => {
      const trigger = document.querySelector(`[data-tooltip=編集]`);
      if (!trigger) return;
      insertActionButton(trigger)
    }, 1000)
  })

  // #js-slack-icon で delegate してる
  new ClipboardJS('#js-slack-icon', {
    text: eventContentsBySlackMarkdown
  });
}

const insertActionButton = trigger => {
  const $menu = trigger?.parentElement?.parentElement
  if (!$menu) return;

  const $wrapper = document.createElement('div')

  $wrapper.innerHTML = `
    <style>
      .slack-icon {
        width: 40px;
        height: 43px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;      
      }

      .slack-icon svg {
        width: 17px; 
        height: 17px;
        fill: #5f6368;
      }
    </style>
    <div id="js-slack-icon" class="slack-icon">
      <svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 24 24">
        <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>
      </svg>
    </div>
  `
  $menu.insertAdjacentHTML('afterbegin', $wrapper.outerHTML)
}

const eventContentsBySlackMarkdown = () => {
  const eventContentList = [
    ...document
      .querySelector(`[jscontroller][jsaction][data-eventid][data-actions-expanded]`)
      .children
  ]
    .find(child => [...child.children].length > 0) // モーダルの出し方によって知らない空 DOM が作られていたのでその制御
    .children[2]
    .children

  const contents = {
    title: eventContentList[0].querySelector(`[data-text]`).textContent,
    datetime: eventContentList[0].querySelector(`[data-text] + *`).textContent,
    room: [...eventContentList[1].querySelectorAll(`[data-text]`)].map(i => i.textContent).join(` / `),
    member: [...document.querySelector(`[aria-label=ゲスト]`).children].map(i => i.getAttribute(`aria-label`).split(`, `)[0]).join(` / `)
  }

  return `>>>
*${contents.title}*
 • ${contents.datetime}
 • ${contents.room}
 • ${contents.member}`
}

setTimeout(main, 4000)
