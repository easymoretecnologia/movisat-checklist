
import { appendFile } from 'fs'
import { fromJSON, parse, stringify, toJSON } from 'flatted'
import { DateTime } from 'luxon'

export default function useLog<T = any>(data: T) {
  const date = DateTime.now().toFormat('yyyy-MM-dd')
  const filename = `logs/error_${date}.log`
  const log = (typeof data === 'string' || typeof data === 'number') ? data : stringify(data)
  const time = DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss')

  appendFile(
    filename,
    `[${time}] ${process.env.NODE_ENV}.critical: ${log}\n\n`,
    (err) => {
      if (err) {
        console.log(err)
      }
    }
  )
}
