import fakeAxios, { tryTo } from '@/fetcher/config'

export type AdFormat = {
  id: number
  name: string
  events: AdFormatEvent[]
}

export type AdFormatEvent = {
  [key: string]: string
}

const ttt: AdFormat = {
  id: 1,
  name: '',
  events: [
    { click: '點擊' },
    { swipe_left: '左滑' },
  ]
}

// 假資料
const dummyData: AdFormat[] = Array.from({ length: 10 }, (_, idx) => ({
  id: idx + 1,
  name: `Ad Format ${idx + 1}`,
  events: idx !== 0 ? [] : [
    { click: '點擊' },
    { swipe_left: '左滑' },
    { swipe_right: '右滑' },
  ] as AdFormatEvent[],
}))

export function getAdFormats() {
  return tryTo(fakeAxios({
    status: 'success',
    data: dummyData,
  }))
}

export function putAdFormat(id: number, body: { events: AdFormatEvent[] }) {
  return tryTo(fakeAxios({
    status: 'success',
    data: {
      id,
      events: body.events,
    }
  }))
}
