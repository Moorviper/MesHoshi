define(["chroma-js", "virtual-dom", "numeral-intl", "filters/genericnode" ],
  function (Chroma, V, numeral, Filter) {

  return function (config, filterManager) {
    var self = this
    var scale = Chroma.scale("YlGnBu").mode("lab")

    var statusTable = document.createElement("table")
    statusTable.classList.add("proportion")

    var meshTable = document.createElement("table")
    meshTable.classList.add("proportion")

    var fwTable = document.createElement("table")
    fwTable.classList.add("proportion")

    var hwTable = document.createElement("table")
    hwTable.classList.add("proportion")

    var geoTable = document.createElement("table")
    geoTable.classList.add("proportion")

    var autoTable = document.createElement("table")
    autoTable.classList.add("proportion")

    var gwTable = document.createElement("table")
    gwTable.classList.add("proportion")

    var gwClientsTable = document.createElement("table")
    gwClientsTable.classList.add("proportion")

    var siteTable = document.createElement("table")
    siteTable.classList.add("proportion")

    function showStatGlobal(o) {
      var content, caption

      if (o.thumbnail) {
        content = document.createElement("img")
        content.src = o.thumbnail
      }

      if (o.caption) {
        caption = o.caption

        if (!content)
          content = document.createTextNode(caption)
      }

      var p = document.createElement("p")

      if (o.href) {
        var link = document.createElement("a")
        link.target = "_blank"
        link.href = o.href
        link.appendChild(content)

        if (caption && o.thumbnail)
          link.title = caption

        p.appendChild(link)
      } else
        p.appendChild(content)

      return p
    }

    function count(nodes, key, f) {
      var dict = {}

      nodes.forEach( function (d) {
        var v = dictGet(d, key.slice(0))

        if (f !== undefined)
          v = f(v)

        if (v === null)
          return

        dict[v] = 1 + (v in dict ? dict[v] : 0)
      })

      return Object.keys(dict).map(function (d) { return [d, dict[d], key, f] })
    }

    function countHW(nodes, key, f) {
      var dict = {}

      nodes.forEach( function (d) {
        var v = dictGet(d, key.slice(0))

        if (f !== undefined)
          v = f(v)

        if (v === null)
          return

        dict[v] = 1 + (v in dict ? dict[v] : 0)
      })

      return Object.keys(dict).map(function (d) {
      // var test
      var hardwareModel = " nopic"
      // console.log(d)
      if (d.toLowerCase().includes("intel"))
        hardwareModel = " Intel"
      else if (d.toLowerCase().includes("amd"))
        hardwareModel = " Amd  "
      else if (d)
        hardwareModel = d

      if (config.hwImg)

      var modelhash = hardwareModel.split("").reduce(function (a, b) { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0)

    // if (config.hwImg) {
      var content = document.createElement("img")
      //content.onerror = function () {content.style.display = "none"}
      content.onerror = function () {
        console.log(d + "  " + modelhash + "    Router-Bild nicht vorhanden !!! create an issue @ https://github.com/Moorviper/Freifunk-Router-Anleitungen/issues")
        content.classList.add("nodeImg")
        content.src = config.hwImg.thumbnail.replace("{MODELHASH}", "unknown")
        // test = "NoPic"
      }
      content.classList.add("nodeImg")
      // console.log(d + " BILD GEFUNDEN !!! ===========")
      content.src = config.hwImg.thumbnail.replace("{MODELHASH}", modelhash)
      // test = "GoGoGo"
    // }
      // try {
      //   var modelhash = hardwareModel.split("").reduce(function (a, b) { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0)
      //   console.log(modelhash)
      //   if (config.hwImg.thumbnail.exists())
      //   // test = showNodeImg(config.hwImg, modelhash)
      //   test = "penis"
      // }
      // catch(err) {
      //   console.log(err.message)
      //   test = "error"
      // }

      return [d, dict[d], key, f]})
    }

  //   function showNodeImg(o, model) {
  //   if (!model)
  //     return undefined
  //   var test
  // var content, caption
  // var modelhash = model.split("").reduce(function (a, b) { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0)

  //   if (o.thumbnail) {
  //     content = document.createElement("img")
  //     //content.onerror = function () {content.style.display = "none"}
  //     content.onerror = function () {
  //       console.log("Router-Bild nicht vorhanden !!! create an issue @ https://github.com/Moorviper/Freifunk-Router-Anleitungen/issues")
  //       content.classList.add("nodeImg")
  //       content.src = o.thumbnail.replace("{MODELHASH}", "unknown")
  //       test = "NoPic"
  //     }
  //     content.classList.add("nodeImg")
  //     content.src = o.thumbnail.replace("{MODELHASH}", modelhash)
  //     test = "GoGoGo"
  //   }

  //   if (o.caption) {
  //     caption = o.caption.replace("{MODELHASH}", modelhash)

  //     if (!content)
  //       content = document.createTextNode(caption)
  //   }

  //   var p = document.createElement("p")
  //   p.appendChild(content)

  //   return test
  // }

    function count2(nodes, key, f) {
      var dict = {}

      nodes.forEach( function (d) {
        var v = dictGet(d, key.slice(0))

        if (f !== undefined)
          v = f(v)

        if (v === null)
          return

        dict[v] = d.statistics.clients + (v in dict ? dict[v] : 0)
      })

      return Object.keys(dict).map(function (d) { return [d, dict[d], key, f] })
    }

    function addFilter(filter) {
      return function () {
        filterManager.addFilter(filter)

        return false
      }
    }

    function fillTable(name, table, data) {
      if (!table.last)
        table.last = V.h("table")

      var max = 0
      data.forEach(function (d) {
        if (d[1] > max)
          max = d[1]
      })

      var items = data.map(function (d) {
        var v = d[1] / max
        var c1 = Chroma.contrast(scale(v), "white")
        var c2 = Chroma.contrast(scale(v), "black")

        var filter = new Filter(name, d[2], d[0], d[3])

        var a = V.h("a", { href: "#", onclick: addFilter(filter) }, d[0])

        var th = V.h("th", a)
        var td = V.h("td", V.h("span", {style: {
                                         width: Math.round(v * 100) + "%",
                                         backgroundColor: scale(v).hex(),
                                         color: c1 > c2 ? "white" : "black"
                                       }}, numeral(d[1]).format("0,0")))

        return V.h("tr", [th, td])
      })

      var tableNew = V.h("table", items)
      table = V.patch(table, V.diff(table.last, tableNew))
      table.last = tableNew
    }

    self.setData = function (data) {
      var onlineNodes = data.nodes.all.filter(online)
      var nodes = onlineNodes.concat(data.nodes.lost)
      var nodeDict = {}

      data.nodes.all.forEach(function (d) {
        nodeDict[d.nodeinfo.node_id] = d
      })

    var statusDict = count(nodes, ["flags", "online"], function (d) {
        return d ? "online" : "offline"
    })

    var meshDict = count(nodes, ["neighbours"], function(d) {
        var links = 0
        d.forEach(function(m) {
            if (!m.link.vpn)
                links++
        })
        if (links > 0)
            return "Freifunkknoten :)"
        return "Hotspot :("
    })

    var fwDict
      if (!config.normalizeVersion)
        fwDict = count(nodes, ["nodeinfo", "software", "firmware", "base"])
      else
        fwDict = count(nodes, ["nodeinfo", "software", "firmware", "base"], function (d) {
          /*if (!config.normalizeVersion)
            return d.release ? d.release : null */
          var regex = /gluon.*(20\d+).(\d+)(?:\.(\d+))?/
          var versiondata = regex.exec(d)
          if (versiondata === null)
            return d
          if (versiondata[3])
            return ("gluon-v" + versiondata[1] + "." + versiondata[2] + "." + versiondata[3])
          return ("gluon-v" + versiondata[1] + "." + versiondata[2])
        })

      var hwDict = countHW(nodes, ["nodeinfo", "hardware", "model"])


      var geoDict = count(nodes, ["nodeinfo", "location"], function (d) {
        return d ? "ja" : "nein"
      })
      var autoDict = count(nodes, ["nodeinfo", "software", "autoupdater"], function (d) {
        if (d === null)
          return null
        else if (d.enabled) {
          if (config.summerizeAutoupdater)
            return (d.branch === "stable") ? "stable" : "unstable"
          return d.branch
        } else
          return "(deaktiviert)"
      })

      var gwDict = count(nodes, ["statistics", "gateway"], function (d) {
        if (d === null)
          return null

        if (d in nodeDict)
          return nodeDict[d].nodeinfo.hostname

        return d
      })

      var gwClientsDict = count2(onlineNodes, ["statistics", "gateway"], function (d) {
        if (d === null)
          return null

        if (d in nodeDict)
          return nodeDict[d].nodeinfo.hostname

        return d
      })

      var siteDict = count(onlineNodes, ["nodeinfo", "system", "site_code"], function (d) {
        var rt = d
        if (config.siteNames)
          config.siteNames.forEach( function (t) {
            if(d === t.site)
              rt = t.name
          })
        return rt
      })

      fillTable("Site", siteTable, siteDict.sort(function (a, b) { return b[1] - a[1] }))
      fillTable("Status", statusTable, statusDict.sort(function (a, b) { return b[1] - a[1] }))
      fillTable("Meshed", meshTable, meshDict.sort(function (a, b) { return b[1] - a[1] }))
      fillTable("Koordinaten", geoTable, geoDict.sort(function (a, b) { return b[1] - a[1] }))
      fillTable("Hardware", hwTable, hwDict.sort(function (a, b) { return b[1] - a[1] }))
      fillTable("Autom. Updates", autoTable, autoDict.sort(function (a, b) { return b[1] - a[1] }))
      fillTable("Gewähltes Gateway", gwTable, gwDict.sort(function (a, b) { return b[1] - a[1] }))
      fillTable("Clients on Gateway", gwClientsTable, gwClientsDict.sort(function (a, b) { return b[1] - a[1] }))
      fillTable("Firmware", fwTable, fwDict.sort(function (a, b) { return b[1] - a[1] }))
    }

    self.render = function (el) {
      var h2

      h2 = document.createElement("h2")
      h2.textContent = "Site"
      el.appendChild(h2)
      el.appendChild(siteTable)

      h2 = document.createElement("h2")
      h2.textContent = "Status"
      el.appendChild(h2)
      el.appendChild(statusTable)

      h2 = document.createElement("h2")
      h2.textContent = "Meshed"
      el.appendChild(h2)
      el.appendChild(meshTable)

      h2 = document.createElement("h2")
      h2.textContent = "Auf der Karte sichtbar"
      el.appendChild(h2)
      el.appendChild(geoTable)

      h2 = document.createElement("h2")
      h2.textContent = "Gewählter Gateway"
      el.appendChild(h2)
      el.appendChild(gwTable)

      h2 = document.createElement("h2")
      h2.textContent = "Clients on Gateway"
      el.appendChild(h2)
      el.appendChild(gwClientsTable)

      h2 = document.createElement("h2")
      h2.textContent = "Hardwaremodelle"
      el.appendChild(h2)
      el.appendChild(hwTable)

      h2 = document.createElement("h2")
      h2.textContent = "Autoupdater"
      el.appendChild(h2)
      el.appendChild(autoTable)

      h2 = document.createElement("h2")
      h2.textContent = "Firmwareversionen"
      el.appendChild(h2)
      el.appendChild(fwTable)

      if (config.globalInfos)
          config.globalInfos.forEach( function (globalInfo) {
            h2 = document.createElement("h2")
            h2.textContent = globalInfo.name
            el.appendChild(h2)

            el.appendChild(showStatGlobal(globalInfo))
          })
    }

    return self
  }
})
