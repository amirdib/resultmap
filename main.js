 var start_coord = [48.856578, 2.351828]


var myStyle = {
    weight: 2,
    fillOpacity: 0
};

var map = L.map('map').setView(start_coord, 11);

L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(map);

var circos = L.geoJson(circos, {style:myStyle})//.addTo(map);

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
};


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
	.style("opacity","0.5")
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

    recolorer('melenchon');
    map.on("viewreset", reset);
    reset();
    
    function reset(){
	console.log('RESET ')
	

	var x_offset =600,
	    y_offset =600;
	svg.attr("width", 1000 + bottomRight[0] - topLeft[0])
	    .attr("height",  1000 + bottomRight[1] - topLeft[1])
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
