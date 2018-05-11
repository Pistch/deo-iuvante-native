export default function prettyDate(dateSource, short) {
  const date = new Date(dateSource),
    nowNumber = Date.now(),
    time = short ?
      `${date.getHours() < 9 ? '0' + date.getHours() : date.getHours()}:${date.getMinutes() < 9 ? '0' + date.getMinutes() : date.getMinutes()}` :
      date.toLocaleTimeString('ru'),
    dayDuration = 1000 * 60 * 60 * 24;

  switch (Math.floor(nowNumber / dayDuration) - Math.floor(dateSource / dayDuration)) {
    case 0: return time;
    case 1: return short ?
      'yesterday' :
      ('yesterday, ' + time);
    default: return short ?
      `${date.getDate()}.${date.getMonth() < 9 ? 0 : ''}${date.getMonth() + 1}` :
      `${date.getDate()}.${date.getMonth() < 9 ? 0 : ''}${date.getMonth() + 1}, ${time}`;
  }
}
