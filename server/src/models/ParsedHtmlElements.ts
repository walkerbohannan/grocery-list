export interface ItemNode {
  data: string,
  type: string,
}

export interface Element {
  attribs: {
    class: string
  },
  children: [
    {
      data: string
    }
  ]
}