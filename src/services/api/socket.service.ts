import { io } from 'socket.io-client'
import { api } from '$services/store'

export default io(api)
