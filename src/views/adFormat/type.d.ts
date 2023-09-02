export type AdFormat = {
  id: number
  name: string
  events: AdFormatEvent[]
}

export type AdFormatEvent = {
  [key: string]: string
}
