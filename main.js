 var start_coord = [48.856578, 2.351828]


var myStyle = {
    weight: 2,
    fillOpacity: 0
};

var map = L.map('map').setView(start_coord, 12);

L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(map);

var circos = L.geoJson(circos, {style:myStyle});

var overlayMaps = {
    "Circonscriptions": circos
};

L.control.layers(overlayMaps).addTo(map);


var w = 600,
    h = 400,
    centered;

m = d3.map(data, function(d, i) {
    if (d != undefined) return d[1];
});

var svg = d3.select(map.getPanes().overlayPane).append("svg"),
    g = svg.append("g").attr("class", "leaflet-zoom-hide");


d3.selection.prototype.moveToFront = function() {
    return this.each(function() {
        this.parentNode.appendChild(this);
    });
};


d3.selection.prototype.moveToBack = function() {
    return this.each(function() {
        var firstChild = this.parentNode.firstChild;
        if (firstChild) {
            this.parentNode.insertBefore(this, firstChild);
        }
	
    });

//    geneLegende(d)
};

function geneLegende(d) {
    console.log('legend')
        $("#paris.legende").empty()
        malegende = "";
        if (d != undefined) {
            for (i = 0; i <= dico[d].steps.length - 2; i++) {
                malegende += "<div class=\"unecouleur\">"
                malegende += "<span class=\"bulle\" style=\"background-color:" + dico[d].color[i] + ";\"></span>"
                malegende += String(dico[d].steps[i]).replace(".", ",")
                if (i != dico[d].steps.length - 2) malegende += " à "
                malegende += String(dico[d].steps[i + 1]).replace("100", "").replace(".", ",") + "&nbsp;" + ((i == dico[d].steps.length - 2) ? "% et +" : "%")
                malegende += "</div>"
            };
        }
        $("#paris .legende").html(malegende)

    }

var svg = d3.select(map.getPanes().overlayPane).append("svg"),
    g = svg.append("g").attr("class", "leaflet-zoom-hide");


d3.json("data/paris_bv.json", function(error, fra) {
    if (error) throw error;
    
    var transform = d3.geoTransform({point: projectPoint}),
	path = d3.geoPath().projection(transform);
    
    var feature = g.selectAll("path")
	.data(topojson.feature(fra, fra.objects.paris).features)
	.enter()
	.append("path")
	.attr("d", path)
	.attr("class", "bv")
	.attr("id", function(d, i) {
	    return "c" + d.properties.id
	})
	.attr("fill", colorer)
	.attr("stroke", colorer)
	.attr("stroke-width", 1)
	.style("opacity","1")
	.on("mouseover", function() {
	    d3.select(this).moveToFront()
		.attr("fill", function() {
		    return d3.rgb(d3.select(this).attr("fill")).darker(1)
		})
	})
	.on("mouseout", function() {
	    d3.select(this).moveToBack()
		.attr("fill", colorer)
	})
	.on("click", redraw);

    


    map.on("moveend", reset);
    reset();
    
    function reset(){
	
    var bounds = path.bounds(topojson.feature(fra, fra.objects.paris))
    var topLeft = bounds[0],
	bottomRight = bounds[1];
	
	var x_offset =0,
	    y_offset =0;
	
	svg.attr("width", 0 + bottomRight[0] - topLeft[0])
	    .attr("height",  0 + bottomRight[1] - topLeft[1])
	    .style("left", -x_offset + topLeft[0] + "px")
	    .style("top", -y_offset + topLeft[1] + "px");

	
	g.attr("transform", "translate(" + (x_offset -topLeft[0]) + "," + (y_offset-topLeft[1]) + ")");

	feature.attr("d", path)
	
    }
    
    function projectPoint(x, y) {
	var point = map.latLngToLayerPoint(new L.LatLng(y, x));
	this.stream.point(point.x, point.y);
    }
});





// /* on recolore */

function recolorer(d) {
    
    var a = dico[d].steps
    b = dico[d].steps.slice(1, -1)

    color = dico[d].color,
        quantize = d3.scaleThreshold()
        .domain(b)
        .range(d3.range(Number(a.length) - 1).map(function(i) {
            return color[i]
        }));

    g.selectAll("path.bv")
        .each(function(e, j) {
            d3.select("#c" + e.properties.id).transition().duration(500)
                .attr("fill", function(f) {
                    return quantize(m.get(f.properties.id)[dico[d].number] / m.get(f.properties.id)[7] * 100)
                })
                .attr("stroke", function(f) {
                    return quantize(m.get(f.properties.id)[dico[d].number] / m.get(f.properties.id)[7] * 100)
                })
        })
        .on("mouseover", function() {
            d3.select(this).moveToFront()
                .attr("fill", function() {
                    return d3.rgb(d3.select(this).attr("fill")).darker(1)
                })
        })
        .on("mouseout", function() {
            d3.select(this).moveToBack()
                .attr("fill", function() {
                    return d3.rgb(d3.select(this).attr("fill")).brighter(1)
                })
        });
       geneLegende(d)
}




/* on revient à la couleur de base*/
function debase(d) {
    g.selectAll("path.bv")
        .each(function(e, j) {
            d3.select("#c" + e.properties.id).transition().duration(500)
                .attr("fill", colorer)
                .attr("stroke", colorer)
                .attr("fill-opacity", 1);
        })
        .on("mouseover", function() {
            d3.select(this).moveToFront()
                .attr("fill", function() {
                    return d3.rgb(d3.select(this).attr("fill")).darker(1)
                })
        })
        .on("mouseout", function() {
            d3.select(this).moveToBack()
                .attr("fill", colorer)
        });

}

function geneLegende(d) {
    $("#paris .legende").empty()
    malegende = "";
    if (d != undefined) {
        for (i = 0; i <= dico[d].steps.length - 2; i++) {
            malegende += "<div class=\"unecouleur\">"
            malegende += "<span class=\"bulle\" style=\"background-color:" + dico[d].color[i] + ";\"></span>"
            malegende += String(dico[d].steps[i]).replace(".", ",")
            if (i != dico[d].steps.length - 2) malegende += " à "
            malegende += String(dico[d].steps[i + 1]).replace("100", "").replace(".", ",") + "&nbsp;" + ((i == dico[d].steps.length - 2) ? "% et +" : "%")
            malegende += "</div>"
        };
    }
    $("#paris .legende").html(malegende)
    //    d3.selectAll(".bulle").style("background-color","#feedf6")
    d3.selectAll(".bulle").style("background-color",function(e,i){
	return dico[d].couleur[i+1];
    })
//    debugger;

}


$("#quidonc").on("change", function(d) {
        var qui = $(this).val();
        if (qui == "entete") debase()
        else recolorer(qui)
    })

function colorer(d) {
    var tableau = m.get(d.properties.id)
    if (tableau != undefined) {
        tableau = tableau.slice(8)
        var max = Math.max.apply(Math, tableau)
        var lequel = data[0][tableau.indexOf(max) + 8]
        return dico[lequel].couleur
    }
};


// BAR PLOT

var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 600 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

// set the ranges
var x = d3.scaleBand()
          .range([0, width])
          .padding(0.1);
var y = d3.scaleLinear()
          .range([height, 0]);
          
// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg_bar = d3.select("body").select("div#barplot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");
 
// get the data
id = "$1-1"
var results = m[id].slice(8);
x.domain(candidats);
y.domain([0, 700]);

svg_bar.selectAll(".bar")
    .data(results)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", function(d, i) { return x(candidats[i]); })
    .attr("width", x.bandwidth())
    .attr("y", function(d) { return y(d); })
    .attr("height", function(d) { return height - y(d); })
    .style("fill", function(d,i) {
	return dico[candidats[i]].couleur;
    });

svg_bar.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));
svg_bar.append("g")
    .call(d3.axisLeft(y));




function sum_by_index_of_a_iterable(iterable,reference_iterable, numeric_iterable)
{
    sum = 0
    iterable.forEach(function(e){
	index = reference_iterable.indexOf(e)
	sum += numeric_iterable[index]
    })
    return sum;
};


non_iste = ["dupontaignan", "lepen","melenchon", "asselineau"]
oui_iste = ["macron", "arthaud", "poutou","fillon"]
indefini = ["cheminade", "lassalle", "hamon"]

score_non_iste = sum_by_index_of_a_iterable(non_iste , candidats, results)
score_oui_iste = sum_by_index_of_a_iterable(oui_iste , candidats, results)
score_indefini = sum_by_index_of_a_iterable(indefini , candidats, results)


var data_pie = [score_non_iste,score_oui_iste,score_indefini];

var width_pie = 600,
    height_pie = 300,
    radius = Math.min(width_pie, height_pie) / 2;

var color_pie = d3.scaleOrdinal()
    .range(["#98abc5", "#7b6888"]);

var arc = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

var labelArc = d3.arc()
    .outerRadius(radius - 40)
    .innerRadius(radius - 40);

var pie = d3.pie()
    .sort(null)
    .value(function(d) { return d; });

var svg_pie = d3.select("#piechart").append("svg")
    .attr("width", width_pie)
    .attr("height", height_pie)
    .append("g")
    .attr("transform", "translate(" + width_pie / 2 + "," + height_pie / 2 + ")");

  var g_pie = svg_pie.selectAll(".arc")
      .data(pie(data_pie))
      .enter().append("g")
      .attr("class", "arc")
      .append("path")
      .attr("d", arc)
    .style("fill", function(d) { return color_pie(d.data_pie); })
    .append("text")
      .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .text(function(d) { return d.data_pie; });




function redraw(d){

    var id = d3.select(this).attr("id").substring(1)
    var results = m["$" + id].slice(8);

    score_non_iste = sum_by_index_of_a_iterable(non_iste , candidats, results)
    score_oui_iste = sum_by_index_of_a_iterable(oui_iste , candidats, results)
    score_indefini = sum_by_index_of_a_iterable(indefini , candidats, results)
    
    var data_pie = [score_non_iste,score_oui_iste,score_indefini];

    
    svg_bar.selectAll(".bar")
	.data(results)
	.transition().duration(1000)
    	.attr("x", function(d, i) {

	    return x(candidats[i]); })
        .attr("y", function(d) { return y(d); })
	.attr("height", function(d) { return height - y(d); })
	.style("fill", function(d,i) {
	    return dico[candidats[i]].couleur;
	});


    svg_pie.selectAll("g.arc")
	.data(pie(data_pie))
	.select("path")
	.attr("d", arc)
    	.select("text")
	.style("fill", function(d) { return color_pie(d.data_pie); })
	.attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
	.attr("dy", ".35em")
    	.text(function(d) { return d.data_pie; });

    
};

d3.select("#range1").on("input", function () {

    svg.selectAll('path.bv')
                    .transition()
                    .duration(400)
                    .ease(d3.easeLinear)
                    .style("opacity", d3.select("#range1").property("value")/100);
    });
console.log(height)
