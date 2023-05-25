const run = () => {
  const data = {
    bin: {
      label: "Bin 1 (Truck)",
      type: "Truck",
      x: 0,
      y: 0,
      z: 0,
      width: 240,
      height: 244,
      depth: 1360,
      loading_meters_total: 13.6,
      loading_meters_used: 10.2,
      maxweight: 20000,
    },
    items: [
      {
        label: "Quadratic Boxes",
        nr: 2,
        x: 0,
        y: 0,
        z: 0,
        width: 200,
        height: 200,
        depth: 200,
        weight: 800,
        sequenceNumber: -1,
      },
      {
        label: "Small Packets",
        nr: 1,
        x: 200,
        y: 0,
        z: 0,
        width: 30,
        height: 80,
        depth: 120,
        weight: 70,
        sequenceNumber: -1,
      },
      {
        label: "Small Packets",
        nr: 1,
        x: 200,
        y: 0,
        z: 120,
        width: 30,
        height: 80,
        depth: 120,
        weight: 70,
        sequenceNumber: -1,
      },
      {
        label: "Quadratic Boxes",
        nr: 2,
        x: 0,
        y: 0,
        z: 200,
        width: 200,
        height: 200,
        depth: 200,
        weight: 800,
        sequenceNumber: -1,
      },
      {
        label: "Small Packets",
        nr: 1,
        x: 200,
        y: 0,
        z: 240,
        width: 30,
        height: 80,
        depth: 120,
        weight: 70,
        sequenceNumber: -1,
      },
      {
        label: "Small Packets",
        nr: 1,
        x: 200,
        y: 0,
        z: 360,
        width: 30,
        height: 80,
        depth: 120,
        weight: 70,
        sequenceNumber: -1,
      },
      {
        label: "Large Boxes",
        nr: 3,
        x: 0,
        y: 0,
        z: 400,
        width: 200,
        height: 240,
        depth: 110,
        weight: 1500,
        sequenceNumber: -1,
      },
      {
        label: "Small Packets",
        nr: 1,
        x: 200,
        y: 0,
        z: 480,
        width: 30,
        height: 80,
        depth: 120,
        weight: 70,
        sequenceNumber: -1,
      },
      {
        label: "Large Boxes",
        nr: 3,
        x: 0,
        y: 0,
        z: 510,
        width: 200,
        height: 240,
        depth: 110,
        weight: 1500,
        sequenceNumber: -1,
      },
      {
        label: "Large Packets",
        nr: 0,
        x: 0,
        y: 0,
        z: 620,
        width: 120,
        height: 180,
        depth: 80,
        weight: 50,
        sequenceNumber: -1,
      },
      {
        label: "Large Packets",
        nr: 0,
        x: 120,
        y: 0,
        z: 620,
        width: 120,
        height: 180,
        depth: 80,
        weight: 50,
        sequenceNumber: -1,
      },
      {
        label: "Large Packets",
        nr: 0,
        x: 0,
        y: 0,
        z: 700,
        width: 120,
        height: 180,
        depth: 80,
        weight: 50,
        sequenceNumber: -1,
      },
      {
        label: "Large Packets",
        nr: 0,
        x: 120,
        y: 0,
        z: 700,
        width: 120,
        height: 180,
        depth: 80,
        weight: 50,
        sequenceNumber: -1,
      },
      {
        label: "Large Packets",
        nr: 0,
        x: 0,
        y: 0,
        z: 780,
        width: 120,
        height: 180,
        depth: 80,
        weight: 50,
        sequenceNumber: -1,
      },
      {
        label: "Large Packets",
        nr: 0,
        x: 120,
        y: 0,
        z: 780,
        width: 120,
        height: 180,
        depth: 80,
        weight: 50,
        sequenceNumber: -1,
      },
      {
        label: "Large Packets",
        nr: 0,
        x: 0,
        y: 0,
        z: 860,
        width: 120,
        height: 180,
        depth: 80,
        weight: 50,
        sequenceNumber: -1,
      },
      {
        label: "Large Packets",
        nr: 0,
        x: 120,
        y: 0,
        z: 860,
        width: 120,
        height: 180,
        depth: 80,
        weight: 50,
        sequenceNumber: -1,
      },
      {
        label: "Large Packets",
        nr: 0,
        x: 0,
        y: 0,
        z: 940,
        width: 120,
        height: 180,
        depth: 80,
        weight: 50,
        sequenceNumber: -1,
      },
      {
        label: "Large Packets",
        nr: 0,
        x: 120,
        y: 0,
        z: 940,
        width: 120,
        height: 180,
        depth: 80,
        weight: 50,
        sequenceNumber: -1,
      },
    ],
    accumulatedItems: [
      {
        label: "Large Packets",
        width: 120,
        height: 180,
        depth: 80,
        weight: 50,
        amount: 10,
      },
      {
        label: "Small Packets",
        width: 30,
        height: 80,
        depth: 120,
        weight: 70,
        amount: 5,
      },
      {
        label: "Quadratic Boxes",
        width: 200,
        height: 200,
        depth: 200,
        weight: 800,
        amount: 2,
      },
      {
        label: "Large Boxes",
        width: 200,
        height: 240,
        depth: 110,
        weight: 1500,
        amount: 2,
      },
    ],
    loaded_items: 19,
    loaded_volume: 45.28,
    loaded_weight: 5450,
    total_volume: 79.6416,
  };

  function defaultMapping() {
    var colors = defaultColors();
    var borderColors = defaultBorderColors();
    return {
      x_start: ["x"],
      y_start: ["y"],
      z_start: ["z"],
      x_length: ["width"],
      y_length: ["height"],
      z_length: ["depth"],
      color: function (item) {
        return colors[item.nr % colors.length];
      },
      border_color: function (item) {
        if (item.sequenceNumber >= 0)
          return "0x" + borderColors[item.sequenceNumber % borderColors.length];
        return "0x000000";
      },
      highlight_color: function (item) {
        if (item.sequenceNumber >= 0)
          return "0x" + borderColors[item.sequenceNumber % borderColors.length];
        return "0xFF0000";
      },
    };
  }

  function defaultColors() {
    return [
      "0xdf7126",
      "0xd9a066",
      "0xeec39a",
      "0xfbf236",
      "0x99e550",
      "0x6abe30",
      "0x37946e",
      "0x4b692f",
      "0x524b24",
      "0xe02f74",
      "0x30a082",
      "0x639bff",
      "0x5ffe4",
      "0xcbfffc",
      "0x9badb7",
      "0x847eee",
      "0x696aee",
      "0xee0000",
      "0x76428a",
      "0xac3232",
      "0xd95763",
      "0xd77bba",
      "0x8f974a",
      "0x8a6f30",
      "0x22f4f1",
      "0x45283c",
      "0x663931",
      "0x8f563b",
    ];
  }

  function defaultBorderColors() {
    return [
      "6C3483",
      "117A65",
      "F1C40F",
      "AF601A",
      "6C3483",
      "1E8449",
      "B7950B",
      "34495E",
    ];
  }

  function binMapping() {
    var colors = defaultColors();
    return {
      x_start: ["x"],
      y_start: ["y"],
      z_start: ["z"],
      x_length: ["width"],
      y_length: ["height"],
      z_length: ["depth"],
      color: "0xff0000",
    };
  }

  function defaultOptions() {
    return {
      width: $(".binpicture").width(),
      height: $(".bintable").height(),
      backgroundColor: 0xeeeeee,
      cameraType: "perspective",
      horizontalRotation: true,
      verticalRotation: true,
      border: 40,
    };
  }

  window.$?.(() => {
    var mouse = {};
    document.onmousemove = function (e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const index = 0;
    $("#packing-wrapper").append(
      '<div id="pack' + index + '" class="packwidget"></div>'
    );

    var items = mapItems(data.items, defaultMapping());
    var bins = mapBins([data.bin], binMapping());
    var packwidget = new PackWidget(bins, items, defaultOptions());
    packwidget.onItemOver = function (item) {
      if (item) {
        highlightItem(item);
        tooltip(mouse.x, mouse.y, item.dataItem.label, item);
      }
    };
    packwidget.onItemOut = function (item) {
      if (item) {
        removeTooltip(item);
        unhighlightItem(item);
      }
    };
    packwidget.create($("#pack" + index).get(0));
  });
};

export { run };
