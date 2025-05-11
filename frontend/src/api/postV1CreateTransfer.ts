const postV1CreateTransfer = async (receiver_address: string, transaction_id: string): string => {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      receiver_address: receiver_address,
      transaction_id: transaction_id,
    }),
  }

  const response = await fetch(import.meta.env.VITE_API_URL + '/v1/transfer', requestOptions)

  if (!response.ok) {
    throw new Error('Transfer request failed.')
  }

  const data = await response.json()

  return data.message
}

export default postV1CreateTransfer
