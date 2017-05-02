 var start_coord = [48.856578, 2.351828]


var map = L.map('map').setView(start_coord, 11);

L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(map);

L.geoJson(circos).addTo(map);



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
};



// var w = document.getElementById("paris").offsetWidth
// echelle = w * 250

// h = w * .7
// m = d3.map(data, function(d, i) {
//     if (d != undefined) return d[1];
// });


// //mobile = false;

// /* Projection conique conforme de Lambert, « Lambert 93 » */
// var projection = d3.geoConicEquidistant()
//     .scale(echelle)
//     .precision(.1)
//     .rotate([-3, 0])
//     .translate([w / 2, h / 3])
//     .center([-.66, 48.856614])
//     .parallels([44, 49]);

// var path = d3.geoPath()
//     .projection(projection);



// TODO: svg:svg
// var svg = d3.select("#pariscarte").insert("svg:svg")
//     .attr("width", "100%")
//     .attr("viewBox", "0 0 " + w + " " + h)

// var carte = svg.append("g")
//     .attr("class", "carte")

// arrondissement = carte.append("g")
//     .attr("id", "arrondissements");

// g = carte.append("g")
//     .attr("class", "bureaux")


// limites = carte.append("g")
//     .attr("class", "limites")

// var svg = d3.select(map.getPanes().overlayPane).append("svg"),
//     g = svg.append("g").attr("class", "leaflet-zoom-hide");

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
	.style("opacity","0.9")
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

    
    var bounds = path.bounds(topojson.feature(fra, fra.objects.paris))
    console.log('var bounds ', bounds);
    var topLeft = bounds[0],
	bottomRight = bounds[1];
    
    
    
    map.on("viewreset", reset);
    reset();
    
    function reset(){
	console.log('RESET ')
	
	
	svg.attr("width", 600 + bottomRight[0] - topLeft[0])
	    .attr("height", 600 + bottomRight[1] - topLeft[1])
	    .style("left", topLeft[0] + "px")
	    .style("top", topLeft[1] + "px");

	g.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");

	feature.attr("d", path)
	
    }
    
    function projectPoint(x, y) {
	var point = map.latLngToLayerPoint(new L.LatLng(y, x));
	// console.log('projectPoint')
	// console.log(x,y)
	// console.log(point.x,point.y)
	this.stream.point(point.x, point.y);
    }
});





// /* on recolore */




// svg.call(d3.zoom()
//     .scaleExtent([1 / 2, 8])
//     .on("zoom", zoomed));

// function zoomed(d) {
//     //debugger;
//     var graph = d3.select('svg');
//     graph
// 	.selectAll('g')
// //    debugger;
// 	.attr("transform", "translate(" + d3.event.transform.x + "," + d3.event.transform.y + ") scale(" + d3.event.transform.k + ")");
//   g.attr("transform", d3.event.transform);
// }

// function dragged(d) {
//   d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
// }

// svg.call(d3.drag()
//         .on("drag", dragged));




// d3.json("data/circo75.json", function(geoJSON) {
    

//     var transform = d3.geoTransform({point: projectPoint}),
//      	path = d3.geoPath().projection(transform);
    
//     var feature_circo = g.selectAll("path")
// 	.data(geoJSON.features)
// 	.enter()
// 	.append("path")
    
//     var bounds = path.bounds(geoJSON)
//     console.log('var bounds ', bounds);
//     var topLeft = bounds[0],
// 	bottomRight = bounds[1];
    

    
//     map.on("viewreset", reset);
//     reset();
    
//     function reset(){
// 	console.log('RESET ')


// 	svg.attr("width", bottomRight[0] - topLeft[0])
// 	    .attr("height", bottomRight[1] - topLeft[1])
// 	    .style("left", topLeft[0] + "px")
// 	    .style("top", topLeft[1] + "px");

// 	g.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");
	
// 	feature_circo.attr("d", path)
// 	    .attr("id", "circonscriptions")
// 	    .attr("class", "circo");
//     }
    
//     function projectPoint(x, y) {
// 	var point = map.latLngToLayerPoint(new L.LatLng(y, x));
// 	this.stream.point(point.x, point.y);
//     }

	
// 	// g.selectAll("path")
// 	//     .classed("active", centered && function(d) { return d === centered; })
// 	//     .style("opacity","1");
	
// 	// g.transition()
// 	//     .duration(750)
// 	//     .selectAll("path.active")
// 	//     .style("opacity","0.2");
	
	

    
// });



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
//       geneLegende(d)
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
    geneLegende(d)

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

}


// $("#quidonc").on("change", function(d) {
//         var qui = $(this).val();
//         if (qui == "entete") debase()
//         else recolorer(qui)
//     })

function colorer(d) {
    var tableau = m.get(d.properties.id)
    if (tableau != undefined) {
        tableau = tableau.slice(8)
        var max = Math.max.apply(Math, tableau)
        var lequel = data[0][tableau.indexOf(max) + 8]
        return dico[lequel].couleur
    }
};
