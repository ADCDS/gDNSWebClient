window.addEventListener("load", function(){
    loadServers();
    // Listeners to click on diferents continents
    document.getElementById("am").addEventListener("click",function(){setMapCenter(am,2);},false);
    document.getElementById("eu").addEventListener("click",function(){setMapCenter(eu,3);},false);
    document.getElementById("af").addEventListener("click",function(){setMapCenter(af,3);},false);
    document.getElementById("as").addEventListener("click",function(){setMapCenter(as,3);},false);
    document.getElementById("oc").addEventListener("click",function(){setMapCenter(oc,4);},false);

    let backs = document.getElementsByClassName('back');
    for(let i in backs){
        if(backs.hasOwnProperty(i)){
            let back = backs[i];
            back.onclick = function(){
                changePage('home');
            };
        }
    }

}, false);
//https://stackoverflow.com/questions/17567344/detect-left-right-swipe-on-touch-devices-but-allow-up-down-scrolling
function detectswipe(el,func) {
    swipe_det = new Object();
    swipe_det.sX = 0;
    swipe_det.sY = 0;
    swipe_det.eX = 0;
    swipe_det.eY = 0;
    var min_x = 20;  //min x swipe for horizontal swipe
    var max_x = 40;  //max x difference for vertical swipe
    var min_y = 40;  //min y swipe for vertical swipe
    var max_y = 50;  //max y difference for horizontal swipe
    var direc = "";
    ele = document.getElementById(el);
    ele.addEventListener('touchstart',function(e){
        var t = e.touches[0];
        swipe_det.sX = t.screenX;
        swipe_det.sY = t.screenY;
    },false);
    ele.addEventListener('touchmove',function(e){
        //git e.preventDefault();
        var t = e.touches[0];
        swipe_det.eX = t.screenX;
        swipe_det.eY = t.screenY;
    },false);
    ele.addEventListener('touchend',function(e){
        //horizontal detection
        if ((((swipe_det.eX - min_x > swipe_det.sX) || (swipe_det.eX + min_x < swipe_det.sX)) && ((swipe_det.eY < swipe_det.sY + max_y) && (swipe_det.sY > swipe_det.eY - max_y)))) {
            if(swipe_det.eX > swipe_det.sX) direc = "r";
            else direc = "l";
        }
        //vertical detection
        if ((((swipe_det.eY - min_y > swipe_det.sY) || (swipe_det.eY + min_y < swipe_det.sY)) && ((swipe_det.eX < swipe_det.sX + max_x) && (swipe_det.sX > swipe_det.eX - max_x)))) {
            if(swipe_det.eY > swipe_det.sY) direc = "d";
            else direc = "u";
        }

        if (direc != "") {
            if(typeof func == 'function') func(el,direc);
        }
        direc = "";
    },false);
}
function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}
function navTab(el,d) {
    if (d==="l" || d==="r") {
        let tabs = document.getElementsByClassName('tabnav');
        let selected_index = 0;
        for (let i in tabs) {
            if (tabs.hasOwnProperty(i)) {
                let tab = tabs[i];
                if (hasClass(tab, 'is-active')) {
                    selected_index = i;
                    tab.classList.remove("is-active");
                }
            }
        }
        selected_index = parseInt(selected_index);
        let next_element = selected_index + 1;
        let next_succ_element = selected_index - 1;
        if (next_element > 4) {
            next_element = 0;
        }
        if (next_succ_element < 0) {
            next_succ_element = 4;
        }
        if (d === "l") {
            tabs[next_element].click();
        } else if (d === "r") {
            tabs[next_succ_element].click();
        }
    }
}



detectswipe('resultDisplay',navTab);

window.addEventListener("resize",reCenter);

// Store current location
let atual = am;

// Set pos and zoom to deferente locations
function setMapCenter(local, zoom){
    map.setCenter(local);
    map.setZoom(zoom);
    atual = local;
}

// Recenter map when window width or height change
function reCenter(){
	map.setCenter(atual);
}

// Pega valores de variaveis passadas por GET para busca
function getAllUrlParams(url) {

  // get query string from url (optional) or window
  var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

  // we'll store the parameters here
  var obj = {};

  // if query string exists
  if (queryString) {

    // stuff after # is not part of query string, so get rid of it
    queryString = queryString.split('#')[0];

    // split our query string into its component parts
    var arr = queryString.split('&');

    for (var i=0; i<arr.length; i++) {
      // separate the keys and the values
      var a = arr[i].split('=');

      // in case params look like: list[]=thing1&list[]=thing2
      var paramNum = undefined;
      var paramName = a[0].replace(/\[\d*\]/, function(v) {
        paramNum = v.slice(1,-1);
        return '';
      });

      // set parameter value (use 'true' if empty)
      var paramValue = typeof(a[1])==='undefined' ? true : a[1];

      // (optional) keep case consistent
      paramName = paramName.toLowerCase();
      paramValue = paramValue.toLowerCase();

      // if parameter name already exists
      if (obj[paramName]) {
        // convert value to array (if still string)
        if (typeof obj[paramName] === 'string') {
          obj[paramName] = [obj[paramName]];
        }
        // if no array index number specified...
        if (typeof paramNum === 'undefined') {
          // put the value on the end of the array
          obj[paramName].push(paramValue);
        }
        // if array index number specified...
        else {
          // put the value at that index number
          obj[paramName][paramNum] = paramValue;
        }
      }
      // if param name doesn't exist yet, set it
      else {
        obj[paramName] = paramValue;
      }
    }
  }

  return obj;
}

// Markers array
var markers = [];
// Servers array
var servers = null;
// Domain to search
var domain;
// Type of search
var type;
// Backend url
var backend_server = "http://dns.adriel.eu:3000";

// Load data from servers to be displayed
function loadServers() {
    var serversReq = new XMLHttpRequest();
    serversReq.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
			servers = JSON.parse(serversReq.response);

			var classe = 'class="mdl-data-table__cell--non-numeric"';
        	for (let key in servers) {
        		if (servers.hasOwnProperty(key)) {
					let server = servers[key];
					var latLng = {lat: server.lat, lng: server.lng};

					let tabela = decideLocation(server.continent);

					//let server_row = htmlToElements('<td '+classe+'>'+ server.city +'</td><td '+classe+'><span id="srttl_'+server.id+'"></span></td><td '+classe+'><span id="srdata_'+server.id+'"></span>');
					let server_row = htmlToElements('<td '+classe+'><div class="server-name">'+ server.city +'</div><span class="srstatus_'+server.id+' small-only"></span></td><td '+classe+'><span id="srdata_'+server.id+'"></span></td><td '+classe+'><span class="srstatus_'+server.id+'"></span></td>');
					tabela.appendChild(server_row);

					var marker = new google.maps.Marker({
						position: latLng,
						map: map,
						title: server.city,
						id: server.id,
						icon: './src/img/un.png'
					});
					
					markers.push(marker);
					// To debug
					/*marker.addListener('click', function(){
						var i = ge(server);
						
						alert("icon: " + markers[i].icon);
					});*/
              	}
          	}
			console.log("Servers carregados");
            document.getElementById('btn').disabled = false;
        }
    };
    serversReq.open("GET", backend_server + "/servers", true);
    serversReq.send();
}

// Return the marker id
function ge(m){
	return m.id - 1;
}

// Return a line of table
function htmlToElements(html) {
    var template = document.createElement('tr');
    template.innerHTML = html;
    return template;
}

// Decide the coluns names
function tableNames(type){
	let res = "<tr>";
	//template.innerHTML = '<th class="mdl-data-table__cell--non-numeric">Nome</th>'+'<th class="mdl-data-table__cell--non-numeric">TTLs</th>';
    res += '<th class="mdl-data-table__cell--non-numeric">Nome</th>';
	if(type === "A"){
        res += '<th class="mdl-data-table__cell--non-numeric">Endereços IPs</th>';
	}
	else if(type === "MX"){
        res += '<th class="mdl-data-table__cell--non-numeric">Servidor de Email</th>';
	}
	else if(type === "NS"){
        res += '<th class="mdl-data-table__cell--non-numeric">Servidor Nome</th>';
	}
	else{
        res += '<th class="mdl-data-table__cell--non-numeric">Entrada TXT</th>';
	}	
	res += "<th></th></tr>";
	return res;
}

// Return the table that will contain the line
function decideLocation(loc){

	let table;

	if(loc === "america"){
		table = document.getElementById('tbam');
	}
	else if(loc === "europe"){
		table = document.getElementById('tbeu');
	}
	else if(loc === "africa"){
		table = document.getElementById('tbaf');
	}
	else if(loc === "oceania"){
		table = document.getElementById('tboc');
	}
	else{
		table = document.getElementById('tbas');
	}

	return table;
}

// Request data from servers to backend
function requestData(domain, type){
	for (let key in servers) {
		if (servers.hasOwnProperty(key)) {
			let server = servers[key];
			let dnsReq = new XMLHttpRequest();
			dnsReq.timeout = 8000;
			dnsReq.onreadystatechange = function(){
                let status = document.getElementsByClassName('srstatus_' + server.id);
                if (this.readyState === 4 && this.status === 200) {
					//document.getElementById('srttl_' + server.id).innerHTML = ttlConcat(dnsReq.response);
                    let dataSelect_r = dataSelect(type,dnsReq.response);
                    let m = getMarker(server.id);
                    document.getElementById('srdata_' + server.id).innerHTML = dataSelect_r;
                    if(dataSelect_r === "Não disponivel."){
                        status[0].innerHTML = '<img src="./src/img/error.png">';
                        status[1].innerHTML = '<img src="./src/img/error.png">';
                        m.setIcon('./src/img/error.png');
                    }else {
                        status[0].innerHTML = '<img src="./src/img/ok.png">';
                        status[1].innerHTML = '<img src="./src/img/ok.png">';
                        m.setIcon('./src/img/ok.png');
                    }

				}
				else if (this.status === 500) {
					//document.getElementById('srttl_' + server.id).innerHTML = "O servidor não respondeu.";
					document.getElementById('srdata_' + server.id).innerHTML = "O servidor não respondeu.";
                    status[0].innerHTML = '<img src="./src/img/error.png">';
                    status[1].innerHTML = '<img src="./src/img/error.png">';

					let m = getMarker(server.id);
					m.setIcon('./src/img/error.png');
				}
			};
			dnsReq.ontimeout = function(){
				//document.getElementById('srttl_' + server.id).innerHTML = "Nosso serviço esta fora do ar.";
				document.getElementById('srdata_' + server.id).innerHTML = "Nosso serviço esta fora do ar.";
                let status = document.getElementsByClassName('srstatus_' + server.id);
                status[0].innerHTML = '<img src="./src/img/error.png">';
                status[1].innerHTML = '<img src="./src/img/error.png">';
			};

			dnsReq.open("GET", backend_server + "/dns/"+server.connection.address+"/"+server.connection.port+"/"+server.connection.type+"/"+type+"/"+domain);
			dnsReq.send();
		}
	}
}

// Return a marker 
function getMarker(id){
	for(var i=0; i < markers.length; i++){
		if(markers[i].id == id)
			return markers[i];
	}
	return null;
}
//https://stackoverflow.com/questions/16748813/mydiv-style-display-returns-blank-when-set-in-master-stylesheet
function getStyle(id, name)
{
    let element = document.getElementById(id);
    return element.currentStyle ? element.currentStyle[name] : window.getComputedStyle ? window.getComputedStyle(element, null).getPropertyValue(name) : null;
}

// Decide the coluns names
function dataSelect(type, res){
	let retorno = "";
	let resp = JSON.parse(res);
	
	if(type === "A"){
		if(resp.length === 0){
			retorno = "Não disponivel."
		}
		else{
			retorno += resp[0].address;
			for(let i=1; i < resp.length; i++){
				retorno +="<br>" + resp[i].address;
			}
		}
	}
	else if(type === "MX"){
		if(resp.length === 0){
			retorno = "Não disponivel."
		}
		else{
			retorno += resp[0].exchange;
			for(let i=1; i < resp.length; i++){
				retorno +="<br>" + resp[i].exchange;
			}
		}	
	}
	else{
		if(resp.length === 0){
			retorno = "Não disponivel."
		}
		else{
			retorno += resp[0].data;
			for(let i=1; i < resp.length; i++){
				retorno +="<br>" + resp[i].data;
			}
		}
	}

	return retorno;
}

// Decide the coluns names
function ttlConcat(res){
	var retorno = "";
	
	var resp = JSON.parse(res);

	if(resp.length === 0){
		retorno = "Não disponivel."
	}
	else{
		retorno += resp[0].ttl;

		for(var i=1; i < resp.length; i++){
			retorno +="<br>" + resp[i].ttl;
		}
	}

	return retorno;
}

// Check if string is a valid domain name
function domainValidate(d){
	console.log('b');
	if (/^(?:(?:(?:[a-zA-z\-]+)\:\/{1,3})?(?:[a-zA-Z0-9])(?:[a-zA-Z0-9-\.]){1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+|\[(?:(?:(?:[a-fA-F0-9]){1,4})(?::(?:[a-fA-F0-9]){1,4}){7}|::1|::)\]|(?:(?:[0-9]{1,3})(?:\.[0-9]{1,3}){3}))(?:\:[0-9]{1,5})?$/.test(d)){
		return true;
	}
	else{
		return false;
	}
}

// Check if string is a valid type of search
function typeValidade(t){
	return t === "A" || t === "NS" || t === "TXT" || t === "MX" || t === "CNAME";

}

let changePage = function(page_str){
	let pages = document.getElementsByClassName('page');
	let page = null;
	for(let i in pages){
		if(pages.hasOwnProperty(i)){
			page = pages[i];
			page.style.display = 'none';
		}
	}
	page = document.getElementById(page_str);


	page.style.display = 'block';
    if(page_str === 'result')
        google.maps.event.trigger(map, 'resize');
};



document.getElementById('toggleMap').onclick = function(){
	let mapdom = document.getElementById('mapcont');
	if(getStyle('mapcont', 'display') === "none"){
		mapdom.style.display = "block";
        google.maps.event.trigger(map, 'resize');
	}else if(getStyle('mapcont', 'display') === "block"){
        mapdom.style.display = "none";
	}
};

let searchFunction = function(e){
    e.preventDefault();
    domain = document.getElementById('search-box').value;
    type = document.getElementById('select').value;
    if(! (domainValidate(domain) && typeValidade(type))){
        document.getElementById('search-box').setCustomValidity('Não é um domínio válido');
        return;
    }

    document.getElementById('tham').innerHTML = tableNames(type);
    document.getElementById('theu').innerHTML = tableNames(type);
    document.getElementById('thaf').innerHTML = tableNames(type);
    document.getElementById('thas').innerHTML = tableNames(type);
    document.getElementById('thoc').innerHTML = tableNames(type);


    document.getElementById("dominio").innerHTML = domain;
    document.getElementById("tipo").innerHTML = type;

    for (let key in servers) {
        if (servers.hasOwnProperty(key)) {
            let server = servers[key];
            document.getElementById('srdata_' + server.id).innerHTML = "";
            let status = document.getElementsByClassName('srstatus_' + server.id);
            status[0].innerHTML = '<img src="./src/img/loading.gif" style="width: 32px; height: 32px">';
            status[1].innerHTML = '<img src="./src/img/loading.gif" style="width: 32px; height: 32px">';
        }
    }
    // Set page title
    document.title = "Busca por " + type.toUpperCase() + " | DNS Redes";
    requestData(domain, type);
    changePage('result');
};
document.getElementById('btn').onclick = searchFunction;
document.getElementById('searchForm').onsubmit = searchFunction;
