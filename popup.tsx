import { Storage } from "@plasmohq/storage"
import { useEffect, useState } from "react"

const storage = new Storage()

function IndexPopup() {
  const [item, setItem] = useState("")
  const [clipboardItems, setClipboardItems] = useState<string[]>([])

  useEffect(() => {
    getClipboardItems()
  }, [])

  async function getClipboardItems() {
    const localClipboardItems = await storage.getItem("clipboardItems")
    if (localClipboardItems) {
      setClipboardItems(JSON.parse(localClipboardItems))
    }
  }

  async function saveItem() {
    if (item) {
      await storage.setItem("clipboardItems", JSON.stringify([...clipboardItems, item]))
      getClipboardItems()
      setItem("")
    }
  }

  async function deleteItem(index: number) {
    await storage.setItem("clipboardItems", JSON.stringify(clipboardItems.filter((_, i) => i !== index)))
    getClipboardItems()
  }
  return (
    <div style={{ width: 400, }}>
      <div style={{ lineHeight: 0.5 }}>
        <p style={{ fontSize: 20, fontWeight: 500 }}>Easy Clip</p>
        <p>Save clipboard items here for quick access</p>
      </div>
      <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 10, marginBottom: 10, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {
          clipboardItems.length > 0 ? clipboardItems.map((clipboardItem, index) => (
            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', gap: 3 }}>
              <span>{clipboardItem}</span>
              <div style={{ display: 'flex', gap: 2 }}>
                <button onClick={() => {
                  navigator.clipboard.writeText(clipboardItem)
                }}
                  style={{ backgroundColor: '#9569d6', padding: 5, paddingRight: 10, paddingLeft: 10, border: 'none', borderRadius: 5, color: '#fff', height: 30 }}>Copy</button>
                <button onClick={() => {
                  deleteItem(index)
                }}
                  style={{ backgroundColor: '#9569d6', padding: 5, paddingRight: 10, paddingLeft: 10, border: 'none', borderRadius: 5, color: '#fff', height: 30 }}>Delete</button>
              </div>
            </div>
          ))
            :
            <p style={{ textAlign: 'center', color: '#ccc' }}>No items saved</p>
        }
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <input type="text" style={{ width: '100%', height: 30, borderRadius: 5, border: '1px solid #666' }} onChange={(e) => setItem(e.target.value)} value={item} />
        <button onClick={saveItem} style={{ backgroundColor: '#9569d6', padding: 5, paddingRight: 10, paddingLeft: 10, border: 'none', borderRadius: 5, color: '#fff' }}>Save</button>
      </div>
    </div>
  )
}

export default IndexPopup
