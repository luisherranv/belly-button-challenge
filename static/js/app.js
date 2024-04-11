const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

//Add IDs to dropdown menu
d3.json(url)
  .then(function(data) {
    let ids = data.metadata.map(entry => entry.id);

    let dropdown = d3.select("#selDataset");
    for (id of ids){
        dropdown.append('option').text(id)
        };

        let defaultValue = ids[0];
        dropdown.property("value", defaultValue); 
        // optionChanged(defaultValue);
        plots(defaultValue);
  });


//Funtion to plot everything depending on selected value
function optionChanged(selectedValue) {
    d3.select('#sample-metadata').html(''); //clear sample metadata
    plots(selectedValue)
  }



function plots(selectedValue){
//Bar Plot
    d3.json(url)
    .then(function(data) {

        let otu_ids2 = data.samples.filter(sample => sample.id == selectedValue)[0].otu_ids.slice(0, 10).map(id => `OTU ${id}`);
        let trace1 = {
        x: data.samples.filter(sample => sample.id == selectedValue)[0].sample_values.slice(0, 10).reverse(),
        y: otu_ids2.reverse(),
        text: data.samples.filter(sample => sample.id == selectedValue)[0].otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: 'h'
        };

        let data2 = [trace1];

        Plotly.newPlot("bar", data2);
    });

//Bubble plot
    d3.json(url)
    .then(function(data) {
        let trace1 = {
            // x: data.samples[0].otu_ids,
            // y: data.samples[0].sample_values,
            // text: data.samples[0].otu_labels,
        x: data.samples.filter(sample => sample.id == selectedValue)[0].otu_ids,
        y: data.samples.filter(sample => sample.id == selectedValue)[0].sample_values,
        text: data.samples.filter(sample => sample.id == selectedValue)[0].otu_labels,
        mode: 'markers',
        marker: {
            size: data.samples.filter(sample => sample.id == selectedValue)[0].sample_values,
            color: data.samples.filter(sample => sample.id == selectedValue)[0].otu_ids,
        }
        };
    
        let data2 = [trace1];
        let layout = {
        xaxis: {
            title: 'OTU IDs'
        },
        };
    
        Plotly.newPlot('bubble', data2, layout);
    });

//Demographic info
    d3.json(url)
    .then(function(data) {
        let md = data.metadata.filter(sample => sample.id == selectedValue)[0];
        d3.select('#sample-metadata').append('div').text(`ID: ${md.id}`);
        d3.select('#sample-metadata').append('div').text(`Ethnicity: ${md.ethnicity}`);
        d3.select('#sample-metadata').append('div').text(`Gender: ${md.gender}`);
        d3.select('#sample-metadata').append('div').text(`Location: ${md.location}`);
        d3.select('#sample-metadata').append('div').text(`bbtype: ${md.bbtype}`);
        d3.select('#sample-metadata').append('div').text(`wfreq: ${md.wfreq}`);

    });


    d3.json(url)
    .then(function(data) {
    let md = data.metadata.filter(sample => sample.id == selectedValue)[0];
    var data = [
        {
          domain: { x: [0, 1], y: [0, 1] },
          value: md.wfreq,
          title: { text: "Belly-Button Washing Frequency" },
          type: "indicator",
          mode: "gauge+number",
          // delta: { reference: 380 },
          gauge: {
            
            axis: { range: [null, 10] },
            bar: { color: "black" },
            steps: [
              { range: [0, 1], color: "rgba(255, 255, 0, 1)" }, // Yellow with higher transparency
              { range: [1, 2], color: "rgba(255, 255, 0, 0.80)" }, // Yellow with lower transparency
              { range: [2, 3], color: "rgba(255, 255, 50, 0.6)" }, // Green
              { range: [3, 4], color: "rgba(255, 255, 50, 0.4)" }, // Green
              { range: [4, 5], color: "rgba(255, 255, 50, 0.2)" }, // Green
              { range: [5, 6], color: "rgba(154, 205, 50, 0.2)" }, // Green
              { range: [6, 7], color: "rgba(154, 205, 50, 0.4)" }, // Green
              { range: [7, 8], color: "rgba(154, 205, 50, 0.6)" }, // Green
              { range: [8, 9], color: "rgba(154, 205, 50, 0.8)" }, // Green
              { range: [9, 10], color: "rgba(154, 205, 50, 1)" }, // Green
            ],
            colorscale: 'YlGn' // Using 'YlGn' color scale
          }
        }
      ];
      
      var layout = { width: 600, height: 450, margin: { t: 0, b: 0 } };
      Plotly.newPlot('gauge', data, layout);
    });
};
