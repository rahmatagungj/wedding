const storage = (table) => {
  if (!localStorage.getItem(table)) {
    localStorage.setItem(table, JSON.stringify({}))
  }

  const get = (key = null) => {
    let data = JSON.parse(localStorage.getItem(table))
    return key ? data[key] : data
  }

  const set = (key, value) => {
    let storage = get()
    storage[key] = value
    localStorage.setItem(table, JSON.stringify(storage))
  }

  const unset = (key) => {
    let storage = get()
    delete storage[key]
    localStorage.setItem(table, JSON.stringify(storage))
  }

  const has = (key) => Object.keys(get()).includes(key)

  return {
    get,
    set,
    unset,
    has,
  }
}

const util = (() => {
  const opacity = (nama) => {
    let nm = document.getElementById(nama)
    let op = parseInt(nm.style.opacity)
    let clear = null

    clear = setInterval(() => {
      if (op >= 0) {
        nm.style.opacity = op.toString()
        op -= 0.025
      } else {
        clearInterval(clear)
        clear = null
        nm.remove()
        return
      }
    }, 10)
  }

  const escapeHtml = (unsafe) => {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;")
  }

  const timer = () => {
    let countDownDate = new Date(
      document
        .getElementById("tampilan-waktu")
        .getAttribute("data-waktu")
        .replace(" ", "T")
    ).getTime()

    setInterval(() => {
      let distance = Math.abs(countDownDate - new Date().getTime())

      document.getElementById("hari").innerText = Math.floor(
        distance / (1000 * 60 * 60 * 24)
      )
      document.getElementById("jam").innerText = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      )
      document.getElementById("menit").innerText = Math.floor(
        (distance % (1000 * 60 * 60)) / (1000 * 60)
      )
      document.getElementById("detik").innerText = Math.floor(
        (distance % (1000 * 60)) / 1000
      )
    }, 1000)
  }

  const music = (btn) => {
    if (btn.getAttribute("data-status") !== "true") {
      btn.setAttribute("data-status", "true")
      audio.play()
      btn.innerHTML = '<i class="fa-solid fa-circle-pause spin-button"></i>'
    } else {
      btn.setAttribute("data-status", "false")
      audio.pause()
      btn.innerHTML = '<i class="fa-solid fa-circle-play"></i>'
    }
  }

  const modal = (img) => {
    document.getElementById("show-modal-image").src = img.src
    new bootstrap.Modal("#modal-image").show()
  }

  const animation = () => {
    const duration = 15 * 1000
    const animationEnd = Date.now() + duration
    const colors = ["#FFC0CB", "#FF1493", "#C71585"]

    const randomInRange = (min, max) => {
      return Math.random() * (max - min) + min
    }

    const heart = confetti.shapeFromPath({
      path: "M167 72c19,-38 37,-56 75,-56 42,0 76,33 76,75 0,76 -76,151 -151,227 -76,-76 -151,-151 -151,-227 0,-42 33,-75 75,-75 38,0 57,18 76,56z",
      matrix: [
        0.03333333333333333, 0, 0, 0.03333333333333333, -5.566666666666666,
        -5.533333333333333,
      ],
    })

    ;(function frame() {
      const timeLeft = animationEnd - Date.now()

      colors.forEach((color) => {
        confetti({
          particleCount: 1,
          startVelocity: 0,
          ticks: Math.max(50, 75 * (timeLeft / duration)),
          origin: {
            x: Math.random(),
            y: Math.abs(Math.random() - timeLeft / duration),
          },
          zIndex: 1057,
          colors: [color],
          shapes: [heart],
          drift: randomInRange(-0.5, 0.5),
          gravity: randomInRange(0.5, 1),
          scalar: randomInRange(0.5, 1),
        })
      })

      if (timeLeft > 0) {
        requestAnimationFrame(frame)
      }
    })()
  }

  const buka = async (button) => {
    button.disabled = true
    document.querySelector("body").style.overflowY = "scroll"
    AOS.init()
    audio.play()

    if (localStorage.getItem("alertClosed")) {
      document.getElementById("alertDiv").style.display = "none"
    }

    opacity("welcome")
    document.getElementById("tombol-musik").style.display = "block"
    timer()

    confetti({
      origin: { y: 0.9 },
      zIndex: 1057,
    })
    animation()
  }

  const show = () => {
    opacity("loading")
    window.scrollTo(0, 0)
  }

  const animate = (svg, timeout, classes) => {
    let handler = null

    handler = setTimeout(() => {
      svg.classList.add(classes)
      handler = null
    }, timeout)
  }

  return {
    buka,
    modal,
    music,
    escapeHtml,
    show,
    animate,
  }
})()

const progress = (() => {
  const assets = document.querySelectorAll("img")
  const info = document.getElementById("progress-info")
  const bar = document.getElementById("bar")
  const barElement = document.getElementsByClassName("progress")[0]

  let total = assets.length
  let loaded = 0

  const progress = () => {
    loaded += 1

    bar.style.width = Math.min((loaded / total) * 100, 100).toString() + "%"
    info.innerText = `Loading assets (${loaded}/${total}) [${parseInt(
      bar.style.width
    ).toFixed(0)}%]`

    if (loaded == total) {
      info.innerText = "All assets loaded"
      barElement.style.display = "none"
      setTimeout(() => {
        util.show()
      }, 1000)
    }
  }

  assets.forEach((asset) => {
    if (asset.complete && asset.naturalWidth !== 0) {
      progress()
    } else {
      asset.addEventListener("load", () => progress())
    }
  })
})()

const audio = (() => {
  let audio = null

  const singleton = () => {
    if (!audio) {
      audio = new Audio()
      audio.src = document
        .getElementById("tombol-musik")
        .getAttribute("data-url")
      audio.load()
      audio.currentTime = 0
      audio.autoplay = true
      audio.muted = false
      audio.loop = true
      audio.volume = 1
    }

    return audio
  }

  return {
    play: () => singleton().play(),
    pause: () => singleton().pause(),
  }
})()
