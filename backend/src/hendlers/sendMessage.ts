export const sendMessage = (ws: WebSocket, type: string, data: unknown) => {
  ws.send(
    JSON.stringify({
      type,
      data: JSON.stringify(data),
      id: 0,
    }),
  );
};
