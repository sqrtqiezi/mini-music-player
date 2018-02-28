const formatTime = time => {
  const minutes = Math.floor(time / 60 % 60);
  const seconds = Math.floor(time % 60);

  return `${formatNumber(minutes)}:${formatNumber(seconds)}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime
}
