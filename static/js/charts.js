x=[]
function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

//Deliverable 1
// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples; 
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var sampleResult = samples.filter(sampleObj => sampleObj.id == sample)
    console.log("sampleResult")
    console.log(sampleResult)
    //  5. Create a variable that holds the first sample in the array.
    var firstSample = sampleResult[0];
    console.log(firstSample)

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = firstSample.otu_ids
    var otu_idsSliced = otu_ids.slice(0,10).map(otu_ids => `OTU ${otu_ids}`).reverse();
    console.log(otu_idsSliced);

    var otu_labels = firstSample.otu_labels
    var otu_labelsSliced = otu_labels.slice(0,10).reverse();
    console.log(otu_labelsSliced);

    var sample_values = firstSample.sample_values
    var sample_valuesSliced = sample_values.slice(0,10).reverse();
    console.log(sample_valuesSliced);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var yticks = otu_idsSliced


    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: sample_valuesSliced,
      y: otu_idsSliced,
      text: otu_labelsSliced,
      name: "Bacterial Species",
      type: "bar",
      orientation: "h"
    }];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found", 
      margin: {
        l:75,
        r:75,
        b:75,
        t:75
      }   
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

//Deliverable 2
// Bar and Bubble charts
  // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'YlGnBu'
      }
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      showledgend: true,
      xaxis: {title: "OTU ID"},
      height: 500,
      width: 1000,
      hovermode: otu_labels
      };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 


  //Deliverable 3  
  // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;
    var metadataArray = metadata.filter(metaObj => metaObj.id == sample);
    x = metadataArray
    console.log("metadataArray")
    console.log(metadataArray)
  // 2. Create a variable that holds the first sample in the metadata array.
    var firstMeta = metadataArray.slice(0);

    console.log("firstMeta")
    console.log(firstMeta)

  // 3. Create a variable that holds the washing frequency
    var washfreq = parseFloat(metadataArray[0].wfreq);


    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      title: {
        text: "<b>Belly Button Washing Frequency</b><br>Scrubs Per Week"
      },
      value: washfreq,
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: {range: [null, 10], dtick: "2"},
        bar: {color: "black"},
        steps: [
          {range: [0,2], color: "red"},
          {range: [2,4], color: "orange"},
          {range: [4,6], color: "yellow"},
          {range: [6,8], color: "green"},
          {range: [8,10], color: "darkgreen"}   
        ]}
      }];
      
      // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 450,
      height: 450,
      automargin: {
        t:0,
        b:0
      }
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);

  });
}



