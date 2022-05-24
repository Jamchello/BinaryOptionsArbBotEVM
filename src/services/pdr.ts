import axios from "axios"
import { PdrData } from "../types"
const pdrDataUrl = 'https://aishsx8zeop6.usemoralis.com:2053/server/functions/getRoundsTX'
export const getPdrContract = async () => {
  const data : PdrData = await axios.post(pdrDataUrl, {
    tokenCode: "BNB"
  }).then(resp => resp.data)
    return data.result[0].address
}