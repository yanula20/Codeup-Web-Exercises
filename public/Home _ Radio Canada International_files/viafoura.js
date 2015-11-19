/* Fichier 21.20 */
/* Lien web: http://s.radio-canada.ca/_js/pluck/viafoura.js */
/* Lien web: http://s.radio-canada.ca/mp/viafoura.js */

var fichier = "21.10";
var RadioCanada = RadioCanada || {};
RadioCanada.Mod = RadioCanada.Mod || {};
RadioCanada.Lib = RadioCanada.Lib || {};
RadioCanada.Lib.Mod = RadioCanada.Lib.Mod || {};
RadioCanada.Web = RadioCanada.Web || {};

RadioCanada.ViafouraGlobalVars = {};
//RadioCanada.ViafouraGlobalVars.CustomViafouraLocation = "../../articles/Design/viafouraRC.css";
//RadioCanada.ViafouraGlobalVars.CustomViafouraLocation = "http://dev.nm.radio-canada.ca/articles/Design/viafouraRC.css";
RadioCanada.ViafouraGlobalVars.ViafouraOnline = true;
//RadioCanada.ViafouraGlobalVars.CustomViafouraLocation = "http://br-s.radio-canada.ca/mp/viafouraRC.css";
RadioCanada.ViafouraGlobalVars.CustomViafouraLocation = "http://s.radio-canada.ca/mp/viafouraCustom.css";
//RadioCanada.ViafouraGlobalVars.CustomViafouraLocation = "http://br-s.radio-canada.ca/mp/viafouraCustom.css";
//RadioCanada.ViafouraGlobalVars.CustomViafouraLocation = "viafouraCustom.css";
RadioCanada.ViafouraGlobalVars.loginbarScriptSrc = 'http://s.radio-canada.ca/mp/rc.oauth.loginbar-1.0.0.js';
RadioCanada.ViafouraGlobalVars.OAuthClientScriptSrc = 'http://s.radio-canada.ca/mp/rc.oauth2.client-1.0.0.js';

RadioCanada.Viafoura = function () {

    //var path = 'http://localhost:54719/';
    //var path = 'http://dev.nm.radio-canada.ca/';
    //var path = 'http://api.radio-canada.ca/viafoura/v1/';
    var path = 'http://api.radio-canada.ca/viafoura/v1/api';
    var viafouraApi = 'https://api.viafoura.com/v2/radio-canada.ca/';

    var CommentsClose = false;
    var memberCenterClose = false;

    var ViafouraOnline = true;
    var AutomaticSetup = true;
    var ViafouraSignupPopupCallbackCalled = false;
    var ViafouraLoginPopupCallbackCalled = false;
    var ViafouraSettingsPopupCallbackCalled = false;
    var ModifyCommentsListCalled = false;
    var Instruction = "<a name=\"commenter\" id=\"commenter\"></a><div id=\"commentForm\"><p class=\"txtLegal\"><span class=\"important\">Important</span> Afin de favoriser des discussions riches, respectueuses et constructives, <strong>chaque commentaire soumis sur les tribunes de <a href=\"http://www.radio-canada.ca\">Radio-Canada.ca</a> sera dorénavant signé des nom(s) et prénom(s) de son auteur</strong> (à l'exception de la zone Jeunesse). Le nom d'utilisateur (pseudonyme) ne sera plus affiché.</p><p class=\"txtLegal\">En nous soumettant vos commentaires, vous reconnaissez que Radio-Canada a le droit de les reproduire et de les diffuser, en tout ou en partie et de quelque manière que ce soit. Veuillez noter que Radio-Canada ne cautionne pas les opinions exprimées. Vos commentaires seront modérés, et publiés s'ils respectent la <a href=\"#\" onclick=\"openPopup('http://www.radio-canada.ca/apropos/conditionsutilisation/netiquette/popUp.shtml', 600,500, 'yes'); return false;\">nétiquette</a>. Bonne discussion !</p></div>";
    var ShowWelcomeMessage = false;
    var LogFileCall = false;

    var J50Npi = {
        currentScript: null,
        getJSON: function (url, data, callback) {
            var src = url + (url.indexOf("?") + 1 ? "&" : "?");
            var head = document.getElementsByTagName("head")[0];
            var newScript = document.createElement("script");
            var params = [];
            var param_name = "";

            this.success = callback;

            //data["callback"] = "RadioCanada.Viafoura.J50Npi.success";
            //data["callback"] = "RadioCanada.Viafoura." + callback;
            data["callback"] = callback;
            for (param_name in data) {
                params.push(param_name + "=" + encodeURIComponent(data[param_name]));
            }
            src += params.join("&");

            newScript.type = "text/javascript";
            newScript.src = src;

            if (this.currentScript) head.removeChild(currentScript);
            head.appendChild(newScript);

        },
        success: null
    };

    var ViafouraUser = {
        id: null,
        comments_made: null,
        name: null,
        email: null,
        user_privilege: null,
        pic_small: null,
        logged: false,
        postingBan: false,
        postingBanReason: ''
    };

    //1
    AddInstructions = function () {
        var widget = GetElementsByClassNameCrossBrowser('viafoura');

        var nouveauteMessage = document.getElementById('viafouraWelcomeMessage');
        if (nouveauteMessage) {
            nouveauteMessage.parentNode.removeChild(nouveauteMessage);
        }

        var instructionDiv = document.getElementById('commentForm');
        if (instructionDiv) {
            instructionDiv.parentNode.removeChild(instructionDiv);
        }

        var nouveaute = '<style> .commentsCloseLink{color: #07428a !important} .commentsCloseLink:hover{color: #07428a !important; text-decoration: underline !important;} .commentsClose{font-family: Arial,Helvetica,sans-serif; line-height: 20px; font-size: 14px;  background-color: #F6F6F6; border: 1px solid #D3D3D3; margin: 10px 0 21px !important; padding: 8px 20px 10px 16px !important} </style>' +
            '<div id="viafouraWelcomeMessage"><img src="http://s.radio-canada.ca/_img/logo/logo-nav-radio-canada.gif"><div class="commentsClose" ><strong>Bienvenue dans les nouvelles tribunes d\'ICI Radio-Canada.ca!</strong><br><br>' +
	        'Nous sommes fiers de vous offrir un nouvel environnement où, nous l\'espérons, vous prendrez encore plus de plaisir à commenter, échanger et réagir.<br><br>' +
            'Les nouvelles tribunes d\'ICI Radio-Canada.ca proposent, en plus d\'une nouvelle apparence, des fonctionnalités qui rendront votre expérience encore plus interactive.<br><br>' +
            'Si vous le souhaitez, vous pouvez ajouter un avatar pour illustrer votre profil. Choisissez cet avatar soigneusement car il devra aussi respecter la <a href="#" class="commentsCloseLink" onclick="openPopup(\'http://www.radio-canada.ca/apropos/conditionsutilisation/netiquette/popUp.shtml\', 600,500, \'yes\'); return false;">Nétiquette</a>.<br><br>' +
            'Enfin, vous remarquerez que votre commentaire, aussitôt soumis, s\'affichera dans la tribune alors qu\'il sera en attente de modération. Vous seul pourrez le voir jusqu\'à ce que l\'équipe de modération l\'ait lu. En cas de rejet, vous en serez informé immédiatement.<br><br>' +
            'Autres points à retenir:<br>' +
            '<ul><li>Vos nom d\'usager et mot de passe demeurent inchangés</li>' +
            '<li>Les commentaires publiés ces derniers mois seront transférés graduellement</li>' +
            '<li>La modération des commentaires se fera selon <a href="#" class="commentsCloseLink" onclick="openPopup(\'http://www.radio-canada.ca/apropos/conditionsutilisation/netiquette/popUp.shtml\', 600,500, \'yes\'); return false;">les mêmes règles</a> </li></ul>' +
            'Allez-y! Découvrez votre nouvel espace d\'expression citoyenne. Et prenez quelques instants pour lire la <a href="http://auditoire.radio-canada.ca/index.php?/Knowledgebase/List/Index/23/tribunes" target="_blank">Foire aux questions (FAQ)</a>.<br><br>' +
            'Nous avons hâte de vous lire!<br><br>' +
            'L\'équipe d\'ICI Radio-Canada.ca<br><br></div></div>';

        // 	En développement, mais plus nécessaire. Sert à ajouter une note dans certains articles 
        //if(GetOgURL() == 'http://ici.radio-canada.ca/nouvelles/International/2014/01/09/004-dieudonne-justice-interdiction-spectacles.shtml')
        //{		
        //nouveaute += '<div class="commentsClose" >Le message de Pierre 2</div>';
        //}

        if (widget !== undefined && widget[0] !== undefined) {
            if (ShowWelcomeMessage) {
                widget[0].innerHTML = Instruction + nouveaute + widget[0].innerHTML;
            }
            else {
                widget[0].innerHTML = Instruction + widget[0].innerHTML;
            }
            window.viafoura.reset();
        }
    },

    //2
    AddVfUniqueIdMetaTag = function (metaValue) {
        if (typeof (metaValue) !== "undefined") {
            if (RadioCanada.Viafoura.CheckIfMetaExists("vf:unique_id") === false) {
                RadioCanada.Viafoura.CreateMetaTag("vf:unique_id", metaValue);
            }
        }
    },

    //
    AlertBannedUserModify = function (e) {
        var oldEmail = '';
        var newEmail = '';

        var oldName = '';
        var newName = '';

        var userId = '';
        if (e.email) {
            newEmail = e.email;
        }
        if (e.name) {
            newName = e.name;
        }
        if (RadioCanada.Viafoura.ViafouraUser.email) {
            oldEmail = RadioCanada.Viafoura.ViafouraUser.email;
        }
        if (RadioCanada.Viafoura.ViafouraUser.name) {
            oldName = RadioCanada.Viafoura.ViafouraUser.name;
        }
        if (RadioCanada.Viafoura.ViafouraUser.id) {
            userId = RadioCanada.Viafoura.ViafouraUser.id;
        }

        var apiURL = RadioCanada.Viafoura.path + '/User/LogModification';

        RadioCanada.Viafoura.J50Npi.getJSON(apiURL, { oldEmail: oldEmail, newEmail: newEmail, oldName: oldName, newName: newName, userId: userId }, null);
    },

    //3
    AppendCustomViafouraCss = function () {
        var linkElements = document.getElementsByTagName("link");
        var link;
        var viafouraCssFounded = false;
        for (var i = 0; i < linkElements.length; i++) {
            if (viafouraCssFounded == false) {
                link = linkElements[i];
                if (link.href) {
                    if (link.href.indexOf("viafouraCustom.css") > -1) {
                        viafouraCssFounded = true;
                    }
                }
            }
        }


        if (viafouraCssFounded == false) {
            var stylesheet = document.createElement('link');
            stylesheet.href = RadioCanada.ViafouraGlobalVars.CustomViafouraLocation;
            stylesheet.rel = 'stylesheet';
            stylesheet.type = 'text/css';
            document.getElementsByTagName('head')[0].appendChild(stylesheet);
        }
    },

    //
    BlockBannedUser = function () {        
        var message = '<div class="encadreViafoura">Votre compte est suspendu parce que vous utilisez une fausse identité ou un avatar inapproprié, ce qui contrevient à la <a class="lienNetiquette" href="#" onclick="openPopup(\'http://www.radio-canada.ca/apropos/conditionsutilisation/netiquette/popUp.shtml\', 600,500, \'yes\'); return false;">nétiquette</a>.<br><br>';
        message += 'Veuillez <a href="http://ici.radio-canada.ca/mon-espace" class="lienParametres">cliquer ici</a> pour modifier vos paramètres.<br><br>';
        message += 'Votre compte sera réactivé dans un délai maximal de 24 heures après la validation de votre identité.<br><br>';
        message += 'L\'équipe d\'ICI.Radio-canada.ca</div>';

        var comment = RadioCanada.Viafoura.GetElementsByClassNameCrossBrowser('vf-comment-form');
        
        if (RadioCanada.Viafoura.ViafouraUser.postingBan && comment[0].innerHTML != message) {
            comment[0].innerHTML = message;
        }
    },

    

    //4    
    BunkerNavBarLogOn = function () {
        if (RadioCanada.Viafoura.ViafouraOnline) {
            window.viafoura.ui.login.show();
        }
        else {
            window.location = 'https://inscription.radio-canada.ca/SSOAuthenticationDomain.ashx?mode=login&redirecturl=' + window.location;
            if (typeof (statsToClics) == 'function') {
                statsToClics('clic_action', 'NavBar_Rouge_SeConnecter', 'clic_contenu', 'NavBar_Rouge_SeConnecter', 'WT.ti', 'NavBar_Rouge_SeConnecter');
            }
        }
    },

    //5    
	BunkerNavBarLogOut = function () {
	    if (RadioCanada.Viafoura.ViafouraOnline) {
	        window.viafoura.session.logout();
	    }
	    else {
	        window.location = 'https://mesabonnements.radio-canada.ca/logout.aspx?redirecturl=' + window.location;
	        if (typeof (statsToClics) == 'function') {
	            statsToClics('clic_action', 'NavBar_Rouge_SeDeconnecter', 'clic_contenu', 'NavBar_Rouge_SeDeconnecter', 'WT.ti', 'NavBar_Rouge_SeDeconnecter')
	        }
	    }
	},

    //6    
    ChangeLabel = function (className, oldText, newText) {
        var container = GetElementsByClassNameCrossBrowser(className);
        var containerIndex = 0;

        if (container !== undefined) {
            while (container[containerIndex] !== undefined) {
                if (oldText == '' || container[containerIndex].innerHTML == oldText) {
                    container[containerIndex].innerHTML = newText;
                }
                containerIndex++;
            }
        }
    },

    //7    
    CheckIfMetaExists = function (propertyname) {
        var metaTagFounded = false;
        var propertyAttr;
        if (typeof (propertyname) !== "undefined") {
            var metaElements = document.getElementsByTagName("meta");
            var meta;
            for (var i = 0; i < metaElements.length; i++) {
                if (metaTagFounded == false) {
                    meta = metaElements[i];
                    propertyAttr = meta.getAttribute("property");
                    if (propertyAttr) {
                        if (propertyAttr.indexOf(propertyname) > -1) {
                            metaTagFounded = true;
                        }
                    }
                }
            }
        }
        return metaTagFounded;
    },

    //8    
    CheckIfViafouraScriptIsIncluded = function (scriptName) {
        var linkElements = document.getElementsByTagName("script");
        var link;
        var viafouraScriptFounded = false;
        for (var i = 0; i < linkElements.length; i++) {
            if (viafouraScriptFounded == false) {
                link = linkElements[i];
                if (link.src) {
                    if (link.src.indexOf(scriptName) > -1) {
                        viafouraScriptFounded = true;
                    }
                }
            }
        }
        return viafouraScriptFounded;

    },

    //9    
    CreateMetaTag = function (property, content) {
        var metatag = document.createElement('meta');
        metatag.setAttribute("content", content);
        metatag.setAttribute("property", property);
        document.getElementsByTagName('head')[0].appendChild(metatag);
    },

    //10    
    ContentMonProfil = function (cpt) {
        if (!cpt) {
            cpt = 0;
        }
        var name = '';

        if (RadioCanada.Viafoura.ViafouraUser.logged) {
            name = RadioCanada.Viafoura.ViafouraUser.name;
        }

        var MonProfil = document.getElementById('monProfilSSO'),
		    html = "";

        if (RadioCanada.Viafoura.ViafouraUser.logged) {
            html += '<!-- Version connecte  -->';
            html += '<h1 class="profil_connecte"><span>Mon profil</span></h1>';
            html += ' <div class="blocContenu blocDemi">';
            html += '   <h2>Bonjour ' + name + '</h2>';
            html += '   <p class="source">Vous &ecirc;tes actuellement connect&eacute; au site de Radio-Canada.ca.</p>';
            html += '  	<p>Si vous souhaitez fermer votre session, vous pouvez le faire en cliquant sur le bouton suivant. Vous pouvez aussi le faire en tout temps en cliquant sur l&rsquo;ic&ocirc;ne <img class="img_connection" src="/mesAbonnements/lib/v3.1/img/bt_deconnection.gif" alt="Visuel de l&rsquo;ic&ocirc;ne «Fermer une session» se retrouvant dans la barre de navigation." title="Visuel de l&rsquo;ic&ocirc;ne «Fermer une session» se retrouvant dans la barre de navigation." /> dans la barre de navigation du haut, &agrave; droite.</p>';
            html += '    <a href="#" onclick="window.viafoura.session.logout(); statsToClics(\'clic_action\',\'NavBar_Rouge_SeDeconnecter\',\'clic_contenu\',\'NavBar_Rouge_SeDeconnecter\',\'WT.ti\',\'NavBar_Rouge_SeDeconnecter\'); return false;" class="se_deconnecter"><span>Fermer une session</span></a>';
            html += ' </div>';
            html += ' <div class="blocContenu blocDemi">';
            html += '    <p>Si vous souhaitez modifier vos informations personnelles, cliquez sur le bouton suivant;';
            html += '    Vous pouvez aussi avoir acc&egrave;s directement &agrave; votre profil en cliquant sur votre nom dans la barre de navigation du haut, &agrave; droite. </p>';
            html += '    <a href="#" onclick="window.viafoura.ui.profile.show(); return false;" class="modif_profil"><span>Modifier mon profil</span></a>';
            html += '    <p>Si vous souhaitez consulter les commentaires que vous avez laiss&eacute;s, cliquez sur le bouton suivant. Vous pouvez aussi activer l&rsquo;option Facebook, qui permet de publier vos commentaires de Radio-Canada.ca sur votre profil personnel Facebook.</p>';
            html += '    <a href="#" onclick="window.viafoura.ui.profile.show(); return false;" class="vos_commentaires"><span>Mes commentaires</span></a>';
            html += ' </div>';
            html += ' <!-- Fin Version connecte --> ';
        }
        else {
            html += '<!-- Version deconnecte ou non inscrit  -->';
            html += '<h1 class="profil"><span>Mon profil</span></h1>';
            html += '  <div class="blocContenu blocIntro">';
            html += '  <p>Bonjour,<br />';
            html += '  En tant que membre de Radio-Canada.ca, vous pouvez en tout temps exprimer vos commentaires et partager votre opinion sur le site, recevoir nos cyberlettres et participer &agrave; nos activit&eacute;s interactives.</p>';
            html += '  </div>';
            html += '  <div class="blocContenu blocDemi">';
            html += '   	<h2>Vous avez d&eacute;j&agrave; un compte?</h2>';
            html += '     <p class="source">Vous n&rsquo;&ecirc;tes pas connect&eacute; au site de Radio-Canada.ca.</p>';
            html += ' 		<p>Si vous poss&eacute;dez un compte et que vous souhaitez y acc&eacute;der, cliquez sur le bouton suivant. Vous pouvez aussi le faire en tout temps en cliquant sur l&rsquo;ic&ocirc;ne <img class="img_connection" src="/mesAbonnements/lib/v3.1/img/bt_connection.gif" alt="Visuel de l&rsquo;ic&ocirc;ne «Ouvrir une session» se retrouvant dans la barre de navigation." title="Visuel de l&rsquo;ic&ocirc;ne «Ouvrir une session» se retrouvant dans la barre de navigation." /> dans la barre de navigation du haut, &agrave; droite.</p>';
            html += '	  <a href="#" onclick="window.viafoura.ui.login.show(); statsToClics(\'clic_action\',\'NavBar_Rouge_SeConnecter\',\'clic_contenu\',\'NavBar_Rouge_SeConnecter\',\'WT.ti\',\'NavBar_Rouge_SeConnecter\'); return false;" class="se_connecter"><span>Ouvrir une session</span></a>';
            html += '   </div>';
            html += '	<div class="blocContenu blocDemi">';
            html += '   	<h2>Vous n&rsquo;avez pas de compte?</h2>';
            html += '       <p>Si vous ne poss&eacute;dez pas de compte sur Radio-Canada.ca, cr&eacute;ez-en un en cliquant sur ce bouton. C&rsquo;est simple et rapide, vous n&rsquo;avez besoin que d&rsquo;une adresse courriel et de vous choisir un nom d&rsquo;utilisateur et un mot de passe. Vous pourrez y voir les commentaires que vous avez laiss&eacute;s sur le site, choisir vos abonnements aux diverses cyberlettres de Radio-Canada.ca et bien plus encore. </p>';
            html += '   	<a href="#" onclick="window.viafoura.ui.signup.show(); return false;" class="inscrivez_vous"><span>Cr&eacute;er un compte</span></a>';
            html += '       <p>Une fois votre compte cr&eacute;&eacute;, vous pourrez utiliser l&rsquo;ic&ocirc;ne <img class="img_connection" src="/mesAbonnements/lib/v3.1/img/bt_connection.gif" alt="Visuel de l&rsquo;ic&ocirc;ne «Ouvrir une session» se retrouvant dans la barre de navigation." title="Visuel de l&rsquo;ic&ocirc;ne «Ouvrir une session» se retrouvant dans la barre de navigation." /> dans la barre de navigation du haut, &agrave; droite, pour acc&eacute;der &agrave; votre compte ou l&rsquo;ic&ocirc;ne <img class="img_connection" src="/mesAbonnements/lib/v3.1/img/bt_deconnection.gif" alt="Visuel de l&rsquo;ic&ocirc;ne «Fermer une session» se retrouvant dans la barre de navigation." title="Visuel de l&rsquo;ic&ocirc;ne «Fermer une session» se retrouvant dans la barre de navigation." /> pour en sortir. Vous pourrez aussi cliquer sur votre nom, &agrave; gauche de l&rsquo;ic&ocirc;ne, pour acc&eacute;der directement &agrave; votre profil.</p>';
            html += ' 	</div>';
            html += '<!-- Fin Version deconnecte ou non inscrit -->';
        }

        MonProfil.innerHTML = html;

        if (cpt < 5 && !RadioCanada.Viafoura.ViafouraUser.logged) {
            setTimeout(function () {
                cpt++;
                ContentMonProfil(cpt);
            }, 500);

        }
    }

    //11    
    DeleteCookie = function (cookieName) {

        if (typeof (cookieName) === "undefined") {
            name = 'acceptSignedComments';
        }
        else {
            name = cookieName;
        }

        var path = '/';
        domain = 'radio-canada.ca'
        secondes = 24 * 60 * 60 * 1000 * 14; //2 semaines

        var today = new Date();
        today.setTime(today.getTime());
        var expires = new Date(today.getTime() - (secondes));
        var secure = "";

        document.cookie = name + "=" + "" +
		((expires) ? ";expires=" + expires.toGMTString() : "") +
		((path) ? ";path=" + path : "") +
		((domain) ? ";domain=" + domain : "") +
		((secure) ? ";secure" : "");
    }

    //12    
    DeleteOptionWithValue = function (optionValue) {


        if (typeof (optionValue) !== "undefined") {
            var optionsToDelete = null;
            var attrValue;

            var options = document.getElementsByTagName("option");
            if (options && options.length > 0) {

                for (var i = 0; i < options.length; i++) {


                    attrValue = options[i].getAttribute("value");
                    if (attrValue && attrValue.indexOf(optionValue) > -1) {
                        optionsToDelete = options[i];
                    }
                }

                if (optionsToDelete != null) {
                    optionsToDelete.parentNode.removeChild(optionsToDelete);
                }
            }
        }

    },

    //13    
	DrawMonProfil = function () {
	    var HTMLBlock = document.getElementById('SSOMonProfil');
	    if (HTMLBlock) {
	        var output = '';
	        output += '<div id="monProfilSSO">';
	        output += '	<a href="https://inscription.radio-canada.ca/SSOAuthenticationDomain.ashx?mode=login&redirecturl=' + window.location + '" class="ouvrir">Ouvrir une session</a>';
	        output += '	<div class="src_login">';
	        output += '		<a href="https://inscription.radio-canada.ca/SSOAuthenticationDomain.ashx?mode=login&redirecturl=' + window.location + '" class="signIn">Ouvrir une session</a>';
	        output += '	</div>';
	        output += '</div>';
	        HTMLBlock.innerHTML = output;
	    }
	}

    //14    
    GetElementsByClassNameCrossBrowser = function (selector) {
        var element;
        if (typeof (selector) === "string") {
            if (typeof (document.getElementsByClassName) !== "undefined") {
                element = document.getElementsByClassName(selector);
                if (element && element[0]) {
                    //element = element[0];
                } else {
                    element = undefined;
                }
            } else {
                // POUR IE 8
                element = document.querySelectorAll("." + selector);
                if (element && element[0]) {
                    //element = element[0];
                } else {
                    element = undefined;
                }
            }
        }
        return element;
    },

    //15    
    GetElementsByClassNameCrossBrowserScope = function (scope, selector) {
        var element;
        if (typeof (selector) === "string") {
            if (typeof (scope.getElementsByClassName) !== "undefined") {
                element = scope.getElementsByClassName(selector);
                if (element && element[0]) {
                    //element = element[0];
                } else {
                    element = undefined;
                }
            } else {
                // POUR IE 8
                element = scope.querySelectorAll("." + selector);
                if (element && element[0]) {
                    //element = element[0];
                } else {
                    element = undefined;
                }
            }
        }
        return element;
    },

    //16    
    GetOgURL = function () {
        var metas = document.getElementsByTagName('meta');

        for (i = 0; i < metas.length; i++) {
            if (metas[i].getAttribute("property") == "og:url") {
                return metas[i].getAttribute("content");
            }
        }

        return "";
    },

    //17    
    GetQueryString = function (qString, stringToParse) {
        if (typeof (stringToParse) === "undefined") {
            hu = window.location.search.substring(1);
        }
        else {
            hu = stringToParse;
        }
        gy = hu.split("&");
        for (i = 0; i < gy.length; i++) {
            ft = gy[i].split("=");
            if (ft[0] == qString) {
                return ft[1];
            }
        }
    },

    //18    
    Get_Cookie = function (c_name) {
        var i, x, y, ARRcookies = document.cookie.split(";");
        for (i = 0; i < ARRcookies.length; i++) {
            x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
            y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
            x = x.replace(/^\s+|\s+$/g, "");
            if (x == c_name) {
                return unescape(y);
            }
        }
    },

    //19    
    IncludeCustomViafouraCss = function () {
        if (!RadioCanada.Viafoura.ViafouraOnline) {
            AppendCustomViafouraCss();
        } else {
            var linkElements = document.getElementsByTagName("link");
            var link;
            var viafouraFounded = false;
            for (var i = 0; i < linkElements.length; i++) {
                if (viafouraFounded == false) {
                    link = linkElements[i];
                    if (link.href) {
                        if (link.href.indexOf("viafoura.css") > -1) {
                            viafouraFounded = true;
                            RadioCanada.Viafoura.AppendCustomViafouraCss();
                        }
                    }
                }
            }


            if (viafouraFounded == false) {
                setTimeout(function () {
                    RadioCanada.Viafoura.IncludeCustomViafouraCss();
                }, 1000);
            }
        }
    },

    //20    
    IncludeViafouraScript = function () {

        var vfScriptSrc;

        var session = Get_Cookie("VfSess");

        if (session != undefined) {

            var userid = RadioCanada.Viafoura.ViafouraUser.id;

            if (document.getElementById('viafoura-platform') == undefined) {

                if (jQuery('.viafoura') != undefined && jQuery('.viafoura')[0] != undefined) {
                    var viafoura = jQuery('.viafoura')[0];
                                                
                
                    var insertdiv = document.createElement('script');
                    insertdiv.id = 'viafoura-platform';                    

                    viafoura.parentNode.insertBefore(insertdiv, viafoura.nextSibling);                
                }
            }

            if (document.getElementById('viafoura-platform') != undefined) {
                document.getElementById('viafoura-platform').setAttribute("data-sid", session);
                document.getElementById('viafoura-platform').setAttribute("data-uid", userid);
            }
        }


        if (RadioCanada.Viafoura.ViafouraOnline) {
            vfScriptSrc = "cdn.viafoura.net/vf.js";
            RadioCanada.ViafouraGlobalVars.ViafouraScriptSrc = '//cdn.viafoura.net/vf.js';
            //vfScriptSelector = jQuery('script[src*="uat.viafoura.com/app/js/vf.js"]');
            //RadioCanada.ViafouraGlobalVars.ViafouraScriptSrc = '//uat.viafoura.com/app/js/vf.js';
            //vfScriptSelector = jQuery('script[src*="vanjos.whothaman.com/app/js/vf.js"]');
            //RadioCanada.ViafouraGlobalVars.ViafouraScriptSrc = '//vanjos.whothaman.com/app/js/vf.js';

        } else {
            vfScriptSrc = "uat.viafoura.com/app/js/vf.js";
            RadioCanada.ViafouraGlobalVars.ViafouraScriptSrc = '//uat.viafoura.com/app/js/vf.js';
        }

        if (RadioCanada.Viafoura.CheckIfViafouraScriptIsIncluded(vfScriptSrc) == false) {
            (function (v, s) {
                v.type = 'text/javascript';
                v.async = !0;
                v.src = RadioCanada.ViafouraGlobalVars.ViafouraScriptSrc;
                s.parentNode.insertBefore(v, s);
            }(document.createElement('script'), document.getElementsByTagName('script')[0]));
        }
    },

    IncludeLoginBarScript = function () {
                
        if (RadioCanada.Viafoura.CheckIfViafouraScriptIsIncluded(RadioCanada.ViafouraGlobalVars.loginbarScriptSrc) == false) {
            (function (v, s) {
                v.type = 'text/javascript';
                v.async = !0;
                v.src = RadioCanada.ViafouraGlobalVars.loginbarScriptSrc;
                s.parentNode.insertBefore(v, s);
            }(document.createElement('script'), document.getElementsByTagName('script')[0]));
        }

        if (RadioCanada.Viafoura.CheckIfViafouraScriptIsIncluded(RadioCanada.ViafouraGlobalVars.OAuthClientScriptSrc) == false) {
            (function (v, s) {
                v.type = 'text/javascript';
                v.async = !0;
                v.src = RadioCanada.ViafouraGlobalVars.OAuthClientScriptSrc;
                s.parentNode.insertBefore(v, s);
            }(document.createElement('script'), document.getElementsByTagName('script')[0]));
        }
    },

    //21   
    Init = function () {
        if (CommentsClose) {
            ShowCommentsClose('viafoura');
        }
        else {
            RadioCanada.Viafoura.IncludeViafouraScript();
            //RadioCanada.Viafoura.IncludeLoginBarScript();
            
            var loadInterval = setInterval(function () {
                if (window.viafoura) {
                    RadioCanada.Viafoura.IncludeCustomViafouraCss();
                    clearInterval(loadInterval);
                    InitEvents();
                }

                return;
            }, 100);
        }
    },

    //22
    InitCallback = function (resultat) {        
        SetUserInfo(resultat);

        RadioCanada.Viafoura.ViafouraUser.id = resultat.result.id;

        LogCall(fichier);

        if (ViafouraOnline) {
            ModifyViafouraWidget();
        }

        WriteLoginStatus();

        LoadNewsletter();
    },

    GetUpakneeUserId = function (email) {
        var callBackFunction = 'GetUpakneeUserIdCallback';
        var apiURL = RadioCanada.Viafoura.path + '/Cyberlettre';
        var source = 'src';
        var langue = 'fr';
        RadioCanada.Viafoura.J50Npi.getJSON(apiURL, { action: "getUser", email: email, source: source, langue: langue, mailingLists: "", fctCallback: callBackFunction }, callBackFunction);
    }

    GetUpakneeUserIdCallback = function (resultat) {

    }

    UpdateUpakneeUser = function (e) {
        var oldEmail = '';
        var newEmail = '';

        var oldName = '';
        var newName = '';

        var userId = '';
        if (e.email) {
            newEmail = e.email;
        }
        if (e.name) {
            newName = e.name;
        }
        if (RadioCanada.Viafoura.ViafouraUser.email) {
            oldEmail = RadioCanada.Viafoura.ViafouraUser.email;
        }
        if (RadioCanada.Viafoura.ViafouraUser.name) {
            oldName = RadioCanada.Viafoura.ViafouraUser.name;
        }
        if (RadioCanada.Viafoura.ViafouraUser.id) {
            userId = RadioCanada.Viafoura.ViafouraUser.id;
        }

        var callBackFunction = 'UpdateUpakneeUserCallback';
        var apiURL = RadioCanada.Viafoura.path + '/Cyberlettre';
        var source = 'src';
        var langue = 'fr';

        if (newEmail && newEmail != '') {
            var email = "{\"oldEmail\":\"" + oldEmail + "\",\"newEmail\":\"" + newEmail + "\"}";

            RadioCanada.Viafoura.J50Npi.getJSON(apiURL, { action: "updateUser", email: email, source: source, langue: langue, mailingLists: "", fctCallback: callBackFunction }, callBackFunction);
        }
    }

    UpdateUpakneeUserCallback = function (resultat) {

    }

    //23   
    InitEvents = function () {
        window.viafoura.subscribe("onLoginSuccess", function (e) {
            LogIn();
        });

        window.viafoura.subscribe("onLogoutSuccess", function (e) {
            RadioCanada.Viafoura.ViafouraUser.logged = false;
            Init();
            LogOut();
        });

        window.viafoura.subscribe("onUserChange", function (e) {
            // TODO: Upaknee notification here.
            UpdateUpakneeUser(e);

            if (RadioCanada.Viafoura.ViafouraUser.postingBan) {
                AlertBannedUserModify(e);
            }
        });

        window.viafoura.ready(function (e) {
            
            AddInstructions();

            ModifyCommentsList();

            WriteLoginStatus();

            var session_id = '';
            var apiURL = '';
            
            //if (window.viafoura && window.viafoura.session && window.viafoura.session.current().id) {                
                //session_id = window.viafoura.session.current().id;
                session_id = Get_Cookie("VfSess");
                
                apiURL = viafouraApi + 'users/current?session=' + session_id + '&cacheBuster=' + Math.random();
            //}
            //else {                
                //apiURL = viafouraApi + 'users/current' + '&cacheBuster=' + Math.random();
            //}

            var callBackFunction = 'InitCallback';
            RadioCanada.Viafoura.J50Npi.getJSON(apiURL, {}, callBackFunction);
        });

        window.viafoura.subscribe("onReset", function (e) {
            ModifyCommentsList();
        });
    },

    //24    
    LoadScript = function (url, callback) {
        // Adding the script tag to the head as suggested before
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;

        // Then bind the event to the callback function.
        // There are several events for cross browser compatibility.
        script.onreadystatechange = callback;
        script.onload = callback;

        // Fire the loading
        head.appendChild(script);
    }

    //25

		LogConnectionProblem = function()
		{
			window.viafoura.ui.login.show(); 
		
			var apiURL = RadioCanada.Viafoura.path + '/Log';
            var lien = window.location;
			var fichier = 'problème de connexion...';
			
            RadioCanada.Viafoura.J50Npi.getJSON(apiURL, { Fichier: fichier, Lien: lien }, null);
			
			//var cookieName = 'l7otk2a'; 
			//var cookiePath = '/auth/oauth/v2';
			 
			//DeleteCookie(cookieName, cookiePath);
			//DeleteCookie(cookieName, cookiePath+"/"); 
		   DeleteCookie("VfSess", null, "ici.radio-canada.ca");  
		   DeleteCookie("VfSess", "/", "ici.radio-canada.ca");
		   DeleteCookie("VfSess", null, ".radio-canada.ca");  
		   DeleteCookie("VfSess", "/", ".radio-canada.ca");  		
		},
		
		DeleteCookie = function(cookieName, path, domain) {        
				
					name = cookieName;
					var secure = "";

						  document.cookie = name + "=" + "" +
			";expires=Thu, 01-Jan-1970 00:00:01 GMT" +
			((path) ? ";path=" + path : "") +
						   ((domain) ? ";domain=" + domain : "") +
			((secure) ? ";secure" : "");
				   },
				   
    LogCall = function (fichier) {
        if (LogFileCall) {
            var apiURL = RadioCanada.Viafoura.path + '/Log';
            var lien = window.location;

            RadioCanada.Viafoura.J50Npi.getJSON(apiURL, { Fichier: fichier, Lien: lien }, null);
        }
    },

    LoginDoneFromLoginBar = function() {
        
    },

    LogoutDoneFromLoginBar = function() {
        
    },

    //26   
    LogIn = function () {
        GetUpakneeUserId(viafoura.users.current().email);

        Reload();

        if (typeof (LoginExternalCallback) == 'function') {
            LoginExternalCallback();
        }
    },

    //27    
    LoadNewsletter = function () {        
        if (document.getElementById('offline_customer') != null) {
            if (RadioCanada.Viafoura.ViafouraUser.logged) {
                ShowNewsLetter();
            }
            else {
                RadioCanada.Viafoura.ShowLoginForm();
            }
        }

    },

    //28    
    LogOut = function () {
        if (typeof (LogoutExternalCallback) == 'function') {
            LogoutExternalCallback();
        }
    },
    
    LoadWidget = function() {
        var session = Get_Cookie("VfSess");

        if (session != undefined) {
                                    
            userid = RadioCanada.Viafoura.ViafouraUser.id;

            if (document.getElementById('viafoura-platform') != undefined) {
                document.getElementById('viafoura-platform').setAttribute("data-sid", session);
                document.getElementById('viafoura-platform').setAttribute("data-uid", userid);
            }
        }

        (function (v, s) {
            v.type = 'text/javascript';
            v.async = !0;
            v.src = '//cdn.viafoura.net/vf.js';
            v.id = "ViafouraScript";
            s.parentNode.insertBefore(v, s);
        }(document.createElement('script'), document.getElementsByTagName('script')[0]));
    },
    
    //29
    ModidyCommentAdminOptions = function () {
        var commentAdminOption = RadioCanada.Viafoura.GetElementsByClassNameCrossBrowser('vf-thread-option');

        if (commentAdminOption !== undefined && commentAdminOption[0] !== undefined) {
            ReplaceCommentSectionOption(commentAdminOption, 0, "Utiliser les paramètres par défaut du site");
            ReplaceCommentSectionOption(commentAdminOption, 1, "Toujours prémodérer cette page et ignorer l'expiration de cette page");
            ReplaceCommentSectionOption(commentAdminOption, 2, "Les commentaires sont fermés sur cette page");
            ReplaceCommentSectionOption(commentAdminOption, 3, "Désactiver et cacher les commentaires sur cette page");
            ReplaceCommentSectionOption(commentAdminOption, 4, "Publier les commentaires sans modération et ignorer l'expiration de cette page");
            ReplaceCommentSectionOption(commentAdminOption, 5, "Modérer jusqu'à l'expiration de cette page");
            ReplaceCommentSectionOption(commentAdminOption, 6, "Publier les commentaires sans modération jusqu'à l'expiration de cette page");
        }
    },

    //30
    ModifyCommentBox = function () {
        var commentBox = RadioCanada.Viafoura.GetElementsByClassNameCrossBrowser('vf-content');
        
        //if (true) {
            //ShowMessageToLog();
        //} 
        
        BlockBannedUser();
        if (commentBox !== undefined && commentBox[0] !== undefined) {
            commentBox[0].setAttribute('placeholder', 'Écrire un commentaire ici');
        }               
    },

    //31
    ModifyCommentsList = function () {
        var elements = GetElementsByClassNameCrossBrowser('vf-twitter-tweet');

        if (elements !== undefined) {
            for (var i = elements.length - 1; i >= 0; i--) {
                elements[i].href = elements[i].href.replace('Check%20out%20this%20comment', 'Partage d\'un commentaire');
                elements[i].href = elements[i].href.replace('Check out this comment', 'Partage d\'un commentaire: ');
            }
        }

        var elementsWidget = GetElementsByClassNameCrossBrowser('vf-commenting');

        if (elementsWidget !== undefined) {

            var childElements = elementsWidget[0].children;
            var temp = 'allo';

            for (var i = childElements.length - 1; i >= 0; i--) {
                if (childElements[i].innerHTML == '<strong>Les commentaires sont fermés</strong>') {
                    childElements[i].innerHTML = '<strong>Cette tribune de commentaires est fermée</strong>';
                }
            }

        }

        var modLabels = GetElementsByClassNameCrossBrowser('vf-moderator');

        if (modLabels !== undefined) {
            for (var i = modLabels.length - 1; i >= 0; i--) {
                modLabels[i].innerHTML = 'Modérateur';
            }
        }

        var likes = GetElementsByClassNameCrossBrowser('vf-likes');
        var LikesDiv = '';
        var nbLike = '';
        if (likes !== undefined) {
            for (var i = likes.length - 1; i >= 0; i--) {

                LikesDiv = GetElementsByClassNameCrossBrowserScope(likes[i], 'vf-count-likes');
                if (LikesDiv !== undefined && LikesDiv[0] !== undefined) {
                    nbLike = LikesDiv[0].innerHTML;

                    if (nbLike == "0" || nbLike == "1") {
                        likes[i].innerHTML = '<span class="vf-count-likes">' + nbLike + '</span> personne aime ce commentaire';
                    }
                    else {
                        likes[i].innerHTML = '<span class="vf-count-likes">' + nbLike + '</span> personnes aiment ce commentaire';
                    }
                }
            }
        }

        var moreReply = GetElementsByClassNameCrossBrowser('vf-replies-button');
        var moreReplyDiv = '';
        var nbReply = '';
        if (moreReply !== undefined) {
            for (var i = moreReply.length - 1; i >= 0; i--) {

                moreReplyDiv = GetElementsByClassNameCrossBrowserScope(moreReply[i], 'vf-replies');
                if (moreReplyDiv !== undefined && moreReplyDiv[0] !== undefined) {
                    nbReply = moreReplyDiv[0].innerHTML;

                    if (nbReply == "0" || nbReply == "1") {
                        moreReply[i].innerHTML = 'Afficher <span class="vf-replies">' + nbReply + '</span> autre réponse';
                    }
                    else {
                        moreReply[i].innerHTML = 'Afficher <span class="vf-replies">' + nbReply + '</span> autres réponses';
                    }
                }
            }
        }

        var trustedUsers = GetElementsByClassNameCrossBrowser('vf-trusted');
        if (trustedUsers !== undefined) {
            for (var i = trustedUsers.length - 1; i >= 0; i--) {
                trustedUsers[i].innerHTML = 'Usager de confiance';
            }
        }

        ModifyCommentsOptions();
    }

    //32
    ModifySortCommentOptions = function () {
        RadioCanada.Viafoura.DeleteOptionWithValue("editor_picks");

        var commentOption = RadioCanada.Viafoura.GetElementsByClassNameCrossBrowser('vf-comments-sort');

        if (commentOption !== undefined && commentOption[0] !== undefined) {
            ReplaceCommentSectionOption(commentOption, 0, "Les plus récents");
            ReplaceCommentSectionOption(commentOption, 1, "Les plus anciens");
            ReplaceCommentSectionOption(commentOption, 2, "Les plus aimés");
            ReplaceCommentSectionOption(commentOption, 3, "Les plus actifs");
            ReplaceCommentSectionOption(commentOption, 4, "Le plus de réponses");
        }
    },

    //33
    ModifyCommentsOptions = function () {

        ModidyCommentAdminOptions();
        ModifySortCommentOptions();
        ModifyCommentBox();

        ChangeLabel('vf-logout', 'DÃ©connexion', 'Déconnexion');
        ChangeLabel('vf-approve-btn', 'Approuver cet Ã©lÃ©ment', 'Approuver cet élément');
        ChangeLabel('vf-pick-btn', 'Faire sÃ©lection de l\'Ã©diteur', 'Faire sélection de l\'éditeur');
        ChangeLabel('vf-error-message', 'Ne peut pas Ãªtre vide', 'Ne peut pas être vide');
        ChangeLabel('vf-disabled-content vf-alert', 'Contenu dÃ©sactivÃ©', 'Contenu désactivé');
        ChangeLabel('vf-spam vf-alert', 'MarquÃ© comme pourriel', 'Marqué comme pourriel');
        ChangeLabel('vf-reply-btn', 'RÃ©pondre', 'Répondre');
        ChangeLabel('vf-info vf-alert', 'En attente de modÃ©ration...', 'En attente de modération...');
        ChangeLabel('vf-disable-btn', 'DÃ©sactiver cet Ã©lÃ©ment', 'Désactiver cet élément');
        ChangeLabel('vf-no-messages', 'There are no comments yet.', '');

        ChangeLabel('vf-flag', 'SignalÃ©', 'Signalé');
        ModifyLoginWindow();
    },

    //34
    ModifyLoginWindow = function () {
        ChangeLabel('vf-link vf-signup', 'CrÃ©er un compte', 'Créer un compte');
        ChangeLabel('vf-modal-title', 'Mot de passe oubliÃ©?:', 'Mot de passe oublié?:');
        ChangeLabel('vf-modal-title', 'CrÃ©er un compte:', 'Créer un compte:');
        ChangeLabel('vf-form-title', 'Connexion avec votre compte Viafoura', 'Connexion avec votre compte');
        ChangeLabel('vf-form-title', 'Ã‰crivez votre courriel', 'Écrivez votre courriel');
        ChangeLabel('vf-link vf-forgot-password', 'Mot de passe oubliÃ©?', 'Mot de passe oublié?');
        ChangeLabel('vf-error-message', 'Incorrect password.', 'Mot de passe invalide.');
		ChangeLabel('vf-error-message', 'Incorrect login credentials.', 'Mot de passe invalide.');
		ChangeLabel('vf-error-message', 'Email required.', 'Adresse courriel obligatoire.');
		ChangeLabel('vf-error-message', 'You have been banned.', 'Votre compte est suspendu.');
        ChangeLabel('vf-error-message', 'Ne peut pas Ãªtre vide', 'Ne peut pas être vide');
        ChangeLabel('vf-error-message', '8 caractÃ¨res minimum', '8 caractères minimum');
        ChangeLabel('vf-link vf-login', 'Retourner Ã\&nbsp; la connexion', 'Retourner à la connexion');
        ChangeLabel('vf-success-message', 'Vous recevrez bientÃ´t un courriel.', 'Vous recevrez bientôt un courriel.');
        ReplaceLabel('vf-error-message', 'Password cannot be blank.', 'Le mot de passe ne peut être vide');
        ReplaceLabel('vf-error-message', 'Unregistered email address.', 'Adresse courriel invalide');
        ChangeLabel('vf-error-message', 'Retourner Ã\&nbsp; la connexion', 'Retourner à la connexion');
        ChangeLabel('vf-error-message', 'Email address already used by a different account.', 'Votre adresse courriel est déjà utilisée.');                                         
        ChangeLabel('vf-settings vf-is-selection', 'ParamÃ¨tres', 'Paramètres');
        ChangeLabel('vf-error-message', 'NÃ©cessaire lorsque vous modifiez un adresse courriel', 'Nécessaire lorsque vous modifiez un adresse courriel');
        ChangeLabel('vf-set-default-avatar', 'Utiliser l\'avatar par dÃ©faut', 'Utiliser l\'avatar par défaut');
        ChangeLabel('vf-success-message', 'Votre profil a Ã©tÃ© modifiÃ© avec succÃ¨s.', 'Votre profil a été modifié avec succès.');
        ReplaceLabel('vf-user-info vf-clearfix', 'AimÃ©s', 'Aimés');

        var commentBox = RadioCanada.Viafoura.GetElementsByClassNameCrossBrowser('vf-name-input');
        if (commentBox !== undefined && commentBox[0] !== undefined) {
            commentBox[0].setAttribute('placeholder', 'Votre nom complet');
        }

        ModifyResetPasswordWindow();
    },

    //35
    ModifyResetPasswordWindow = function () {
        var parent = RadioCanada.Viafoura.GetElementsByClassNameCrossBrowser("vf-password-retrieval");
        if (parent && parent[0]) {
            var selectorWarning = RadioCanada.Viafoura.GetElementsByClassNameCrossBrowserScope(parent[0], "vf-form-actions");
            if (selectorWarning && selectorWarning[0]) {

                selectorWarning[0].innerHTML = selectorWarning[0].innerHTML.replace('Un nouveau mot de passe temporaire vous sera envoyé par courriel par notre partenaire Viafoura. Veuillez utiliser ce mot de passe pour vous connecter à nouveau. Nous vous conseillons de changer de mot de passe après votre connexion.<br><br>', '');
                selectorWarning[0].innerHTML = 'Un nouveau mot de passe temporaire vous sera envoyé par courriel par notre partenaire Viafoura. Veuillez utiliser ce mot de passe pour vous connecter à nouveau. Nous vous conseillons de changer de mot de passe après votre connexion.<br><br>' + selectorWarning[0].innerHTML;
            }
        }
    },

    //ModifySettingsWindow
    ModifySettingsWindow = function () {

        /*
        var parent = RadioCanada.Viafoura.GetElementsByClassNameCrossBrowser("vf-settings-container");
        if (parent && parent[0]) {
            var emailInput = document.getElementsByName("vf_email");
            if (emailInput && emailInput[0]) {
                emailInput[0].style.display = "none";
                emailInput[0].previousSibling.previousSibling.innerHTML = "";
            }
        }*/

        var parent = RadioCanada.Viafoura.GetElementsByClassNameCrossBrowser("vf-settings vf-is-selection");
        if (parent && parent[0]) {
            /*var emailInput = document.getElementsByName("vf_email");
            if (emailInput && emailInput[0]) {
                emailInput[0].style.display = "none";
                emailInput[0].previousSibling.previousSibling.innerHTML = "";
            }*/
            parent[0].style.display = "none";
        }

        
		
		
    },

    //36
    ModifySignupWindow = function () {
        var SignupContainer = GetElementsByClassNameCrossBrowser('vf-user-signup');


        if (SignupContainer) {
            var SignupTitle = RadioCanada.Viafoura.GetElementsByClassNameCrossBrowserScope(SignupContainer[0], 'vf-form-title');

            if (SignupTitle) {
                SignupTitle[0].innerHTML = 'Créer un compte';
            }
        }

        ChangeLabel('vf-error-message', 'Email address already used by a different account.', 'Votre adresse courriel est déjà utilisée.');

        var signUpButton = RadioCanada.Viafoura.GetElementsByClassNameCrossBrowser("vf-submit-button");
        if (signUpButton && signUpButton[0] && signUpButton[0].value != "S'incrire") {
            signUpButton[0].value = "S'inscrire";
        }
    },

    //
    ModifyViafouraWidget = function () {
        VerifyCommentsListLoaded(function () {
            ModifyCommentsList();
        });

        ViafouraSignupPopupLoaded(function () {
            ModifySignupWindow();
        });

        ViafouraLoginPopupLoaded(function () {
            ModifyLoginWindow();
        });

        ViafouraSettingsPopupLoaded(function () {
            ModifySettingsWindow();
        });

    }

    //37
    Reload = function () {
        var session_id = '';
        var apiURL = '';
        if (window.viafoura && window.viafoura.session && window.viafoura.session.current().id) {
            session_id = window.viafoura.session.current().id;
            apiURL = viafouraApi + 'users/current?session=' + session_id;
        }
        else {
            apiURL = viafouraApi + 'users/current';
        }

        var callBackFunction = 'ReloadCallback';
        RadioCanada.Viafoura.J50Npi.getJSON(apiURL, {}, callBackFunction);
    },

    //38
    ReloadCallback = function (resultat) {
        RadioCanada.Viafoura.ViafouraUser.id = resultat.result.id;

        SetUserInfo(resultat);

        if (CommentsClose) {
            ShowCommentsClose('viafoura');
        }

        if (ViafouraOnline) {
            ModifyViafouraWidget();
        }

        WriteLoginStatus();

        if (typeof (LoginExternalCallback) == 'function') {
            LoginExternalCallback();
        }
    },

    //39
    ReplaceCommentSectionOption = function (commentOption, index, newText) {

        if (commentOption[0].options[index] !== undefined) {
            commentOption[0].options[index].innerHTML = newText;
        }
    },

    //40
    ReplaceLabel = function (className, oldText, newText) {
        var container = GetElementsByClassNameCrossBrowser(className);
        var containerIndex = 0;

        if (container !== undefined) {
            while (container[containerIndex] !== undefined) {
                container[containerIndex].innerHTML = container[containerIndex].innerHTML.replace(oldText, newText);;
                containerIndex++;
            }
        }
    },

    //41
    SaveCyberletter = function () {
        var mailingLists = new Array();
        document.getElementById('btSubmit').disabled = true;

        /*
        mailingLists[0] = "3";
        mailingLists[1] = "4";
        mailingLists[2] = "5";
        mailingLists[3] = "6";
        mailingLists[4] = "7";
        mailingLists[5] = "8";
        mailingLists[6] = "9";
        mailingLists[7] = "10";
        mailingLists[8] = "12";
        mailingLists[9] = "17";

        mailingLists[10] = "2";
        mailingLists[11] = "16";
        mailingLists[12] = "21";

        var query = "[";
        var SEP = "";
        var subscribe = "";
        for (i = 0; i < mailingLists.length; i++) {
            if (document.getElementById('cyberlettre-' + mailingLists[i])) {
                if (document.getElementById('cyberlettre-' + mailingLists[i]).checked == true) {
                    query += SEP + "{\"ID\":\"" + mailingLists[i] + "\", \"Name\":\"\", \"Subscribe\":\"1\"}";
                }
                else {
                    query += SEP + "{\"Id\":\"" + mailingLists[i] + "\", \"Name\":\"\", \"Subscribe\":\"0\"}";
                }
                SEP = ",";
            }
        }

        query += "]";
        */
        var query = "[";
        var SEP = "";
        var i = 0;
        var cyberlettreId;
        while (document.getElementById('keyValueCyberlettre-' + i)) {
            cyberlettreId = document.getElementById('keyValueCyberlettre-' + i).value;
            if (document.getElementById('cyberlettre-' + cyberlettreId).checked == true) {
                query += SEP + "{\"Id\":\"" + cyberlettreId + "\", \"Name\":\"\", \"Subscribe\":\"1\"}";
            }
            else {
                query += SEP + "{\"Id\":\"" + cyberlettreId + "\", \"Name\":\"\", \"Subscribe\":\"0\"}";
            }
            SEP = ",";
            i++;
        }

        query += "]";
        var callBackFunction = 'SaveCyberletterCallback';
        var apiURL = RadioCanada.Viafoura.path + '/Cyberlettre';
        var email = RadioCanada.Viafoura.ViafouraUser.email;
        //var langue = 'fr';
        var langue = '5';

        RadioCanada.Viafoura.J50Npi.getJSON(apiURL, { action: "save", email: email, langue: langue, mailingLists: query, fctCallback: callBackFunction }, callBackFunction);
    },

    //42
	SaveCyberletterCallback = function () {
	    window.location.reload(true);
	},

    //
    SaveRciCyberletter = function () {


        if (document.getElementById('btnSubmit')) {
            document.getElementById('btnSubmit').disabled = true;
        }

        var email = '';

        if (document.getElementById('email_txt')) {
            email = document.getElementById('email_txt').value;
            document.getElementById('email').value = email;
        }

        var francais = false;
        if (document.getElementById('22')) {
            francais = document.getElementById('22').checked;
        }

        var anglais = false;
        if (document.getElementById('23')) {
            anglais = document.getElementById('23').checked;
        }

        var espagnol = false;
        if (document.getElementById('24')) {
            espagnol = document.getElementById('24').checked;
        }

        var chinois = false;
        if (document.getElementById('25')) {
            chinois = document.getElementById('25').checked;
        }

        var arabe = false;
        if (document.getElementById('26')) {
            arabe = document.getElementById('26').checked;
        }

        var query = "[";
        query += "{\"Id\":\"1\", \"Name\":\"\", \"Subscribe\":\"" + francais + "\"},";
        query += "{\"Id\":\"2\", \"Name\":\"\", \"Subscribe\":\"" + anglais + "\"},";
        query += "{\"Id\":\"3\", \"Name\":\"\", \"Subscribe\":\"" + espagnol + "\"},";
        query += "{\"Id\":\"4\", \"Name\":\"\", \"Subscribe\":\"" + chinois + "\"},";
        query += "{\"Id\":\"5\", \"Name\":\"\", \"Subscribe\":\"" + arabe + "\"}";
        query += "]";

        document.getElementById('mailingLists').value = query;

        var langue = GetUpakneeeLangue();
        document.getElementById('langue').value = langue;

        var callBackFunction = 'SaveRciCyberletterCallback';
        document.getElementById('fctCallback').value = callBackFunction;

        //var apiURL = RadioCanada.Viafoura.path + '/Cyberlettre';

        //RadioCanada.Viafoura.J50Npi.getJSON(apiURL, { action: "saveRci", email: email, langue: langue, mailingLists: query, fctCallback: callBackFunction }, callBackFunction);        
        document.getElementById("rci").submit();
    },

    GetUpakneeeLangue = function () {
        var langue = 'fr';
        var url = window.location + '';
        var urlPart = url.split('/');
        var iLangue = 5;

        if (urlPart.length >= 4) {
            langue = urlPart[3];
        }

        switch (langue) {
            case 'fr':
                iLangue = 5;
                break;
            case 'en':
                iLangue = 6;
                break;
            case 'es':
                iLangue = 7;
                break;
            case 'ar':
                iLangue = 8;
                break;
            case 'zh':
                iLangue = 9;
                break;
        }
        return iLangue;
    },

    GetLangue = function () {
        var langue = 'fr';
        var url = window.location + '';
        var urlPart = url.split('/');

        if (urlPart.length >= 4) {
            langue = urlPart[3];
        }

        return langue;
    },

    SaveRciCyberletterCallback = function () {
        var langue = GetLangue();

        window.location = 'http://www.rcinet.ca/' + langue + '/cybermagazine/abonnement/';
    },

    //43
	Set_Cookie = function (name, value) {
	    path = '/';
	    domain = 'radio-canada.ca'
	    secondes = 24 * 60 * 60 * 1000 * 14; //2 semaines
	    var today = new Date();
	    today.setTime(today.getTime());
	    var expires = new Date(today.getTime() + (secondes));
	    var secure = "";


	    document.cookie = name + "=" + value +
		((expires) ? ";expires=" + expires.toGMTString() : "") +
		((path) ? ";path=" + path : "") +
		((domain) ? ";domain=" + domain : "") +
		((secure) ? ";secure" : "");
	},

    //
    SetUserInfo = function (resultat) {
        
        //if (RadioCanada.Viafoura.ViafouraUser.id && RadioCanada.Viafoura.ViafouraUser.id != '0' || (resultat.result.id && resultat.result.id != '0')) {
        if (resultat.result.id && resultat.result.id != '0') {
            if (!RadioCanada.Viafoura.ViafouraUser.logged) {                
                window.viafoura.reset();
            }
            RadioCanada.Viafoura.ViafouraUser.logged = true;
            RadioCanada.Viafoura.ViafouraUser.comments_made = resultat.result.comments_made;
            RadioCanada.Viafoura.ViafouraUser.name = resultat.result.name;
            RadioCanada.Viafoura.ViafouraUser.email = resultat.result.email;
            RadioCanada.Viafoura.ViafouraUser.user_privilege = resultat.result.user_privilege;
            RadioCanada.Viafoura.ViafouraUser.pic_small = resultat.result.pic_small;
            RadioCanada.Viafoura.ViafouraUser.postingBan = (resultat.result.ban_level == "posting");
            RadioCanada.Viafoura.ViafouraUser.postingBanReason = '';
        }
        else {
            RadioCanada.Viafoura.ViafouraUser.logged = false;
        }
    },

    //44
    ShowCenterMemberCloseMessage = function () {
        var MonProfil = document.getElementById('SSOMonProfil'),
		    html = "";

        html += '<!-- Version deconnecte ou non inscrit  -->';
        html += '<h1 class="profil"><span>Mon profil</span></h1>';

        html += '<style> .commentsClose{font-family: Arial,Helvetica,sans-serif; line-height: 20px; font-size: 14px;  background-color: #F6F6F6; border: 1px solid #D3D3D3; margin: 23px 0 21px; padding: 8px 20px 10px 16px;} </style><div class="commentsClose">Chers internautes, <br><br>' +
        'Nos tribunes de commentaires sont actuellement fermées pour permettre une mise à niveau.<br><br>' +
        'L\'équipe de ICI Radio-Canada.ca prévoit que les tribunes seront disponibles à partir de 17h00.<br><br>' +
        'Merci de votre patience et de votre fidélité!<br><br>' +
        'L\'équipe de ICI Radio-Canada.ca<br><br></div>';


        MonProfil.innerHTML = html;

    },

    //45
    ShowComments = function (articleID) {
        RadioCanada.Viafoura.IncludeCustomViafouraCss();

        var pluckDiv = document.getElementById('pluckComments-0');
        // Vérifier que le sélecteur existe

        if (pluckDiv) {
            var viafouraDiv = RadioCanada.Viafoura.GetElementsByClassNameCrossBrowser("viafoura");

            if (!(viafouraDiv && viafouraDiv[0])) {
                RadioCanada.Viafoura.AddVfUniqueIdMetaTag(articleID);
                pluckDiv.innerHTML = '<div class="viafoura"><div class="vf-comments vf-widget" data-widget="comments" ></div></div>';
            }

            RadioCanada.Viafoura.IncludeViafouraScript();
            //RadioCanada.Viafoura.IncludeLoginBarScript();

            var loadInterval = setInterval(function () {
                if (window.viafoura) {
                    clearInterval(loadInterval);
                    InitEvents();
                }

                return;
            }, 100);
        }
    },

    //46
	ShowCommentsClose = function (divId) {
	    if (document.getElementById(divId) !== null) {
	        document.getElementById(divId).innerHTML = '<style> .commentsClose{font-family: Arial,Helvetica,sans-serif; line-height: 20px; font-size: 14px;  background-color: #F6F6F6; border: 1px solid #D3D3D3; margin: 10px 0 21px; padding: 8px 20px 10px 16px;} </style>' +
            '<img src="http://s.radio-canada.ca/_img/logo/logo-nav-radio-canada.gif">' +
            '<div class="commentsClose" id="container-document"><b>Les tribunes d\'ICI Radio-Canada.ca font peau neuve</b><br><br>' +
	        'Les tribunes d\'ICI Radio-Canada.ca sont actuellement fermées pour permettre de grandes <i>rénovations</i> destinées à rendre votre expérience encore plus agréable.<br><br>' +
            'Revenez-nous dans les prochaines heures pour découvrir nos nouveaux espaces de commentaires. Entre-temps, vous pouvez consulter notre <a href="http://auditoire.radio-canada.ca/index.php?/Knowledgebase/List/Index/23/tribunes" target="_blank">Foire aux questions (FAQ)</a>.<br><br>' +
            'Quelques points à retenir:<br>' +
            '<ul><li>Vos nom d\'usager et mot de passe demeurent inchangés</li>' +
            '<li>Les commentaires publiés ces derniers mois seront transférés graduellement</li>' +
            '<li>La modération des commentaires se fera selon <a href="#" onclick="openPopup(\'http://www.radio-canada.ca/apropos/conditionsutilisation/netiquette/popUp.shtml\', 600,500, \'yes\'); return false;">les mêmes règles</a> </li></ul>' +
	        'Nous croyons que ce changement rendra votre expérience sur ICI Radio-Canada.ca encore plus intéressante et interactive.<br><br>' +
            'À plus tard!<br><br>' +
            'L\'équipe d\'ICI Radio-Canada.ca<br><br></div>';
	    }
	},

    //47
    ShowLoginForm = function () {
        // changement des liens des boutons 
        // Bouton "Se connecter" 
        var seConnecterElement = RadioCanada.Viafoura.GetElementsByClassNameCrossBrowser("se_connecter");
        if (seConnecterElement && seConnecterElement[0]) {
            seConnecterElement[0].setAttribute("href", "#");
            seConnecterElement[0].setAttribute("onclick", "rcOAuth2Client.login()");
        }

        var inscrivezVousElement = RadioCanada.Viafoura.GetElementsByClassNameCrossBrowser("inscrivez_vous");
        if (inscrivezVousElement && inscrivezVousElement[0]) {
            inscrivezVousElement[0].setAttribute("href", "#");
            inscrivezVousElement[0].setAttribute("onclick", "window.viafoura.ui.signup.show()");
        }

        var offlineCustomerElement = document.getElementById('offline_customer');
        if (offlineCustomerElement) {
            offlineCustomerElement.style.display = "block";
        }

        var onlineCustomerElement = document.getElementById('online_customer');
        if (onlineCustomerElement) {
            onlineCustomerElement.style.display = "none";
        }
    },

    ShowMessageToLog = function () {
        if (RadioCanada.Viafoura.ViafouraUser.logged) {
            var message = '<div class="connexionViafoura"><a href="http://ici.radio-canada.ca/mon-espace" target="_blank">' + ViafouraUser.name + '</a><!-- | <a href="#" onclick="rcOAuth2LoginBar.logout();">Déconnexion</a> --></div>';

            var comment = RadioCanada.Viafoura.GetElementsByClassNameCrossBrowser('vf-login-widget');

            if (comment != undefined && comment[0] != undefined) {
                if (comment[0].innerHTML != message) {
                    comment[0].innerHTML = message;
                }
            }
        } else {                    
            var message = '<div class="connexionViafoura"><a href="#" onclick="rcOAuth2Client.login();">Connexion</a> | <a href="#" onclick="rcOAuth2Client.login();">S\'inscrire</a></div>';
			
			message += '<br><a href="#" onclick="RadioCanada.Viafoura.LogConnectionProblem();">Problème de connexion?</a>';

            var comment = RadioCanada.Viafoura.GetElementsByClassNameCrossBrowser('vf-comment-box');

            if (comment != undefined && comment[0] != undefined) {
                if (comment[0].innerHTML != "") {
                    comment[0].innerHTML = "";
                }
            }

            var connexion = RadioCanada.Viafoura.GetElementsByClassNameCrossBrowser('vf-login-widget');

            if (connexion != undefined && connexion[0] != undefined) {
                if (connexion[0].innerHTML != message) {
                    connexion[0].innerHTML = message;
                }
            }
        }
    },

    //48
	ShowNewsLetter = function () {
	    

	    document.getElementById('message').innerHTML = "Chargement en cours...";
	    document.getElementById('offline_customer').style.display = "none";	    
		var email = RadioCanada.Viafoura.ViafouraUser.email;
		
	    var callBackFunction = 'ShowNewsLetterCallback';
	    var apiURL = RadioCanada.Viafoura.path + '/Cyberlettre/';
	    var source = 'src';
	    var langue = 'fr';

	    RadioCanada.Viafoura.J50Npi.getJSON(apiURL, { action: "show", email: email, source: source, langue: langue, fctCallback: callBackFunction, t: Date.now() }, 'ShowNewsLetterCallback');
	},

    //49
	ShowNewsLetterCallback = function (resultat) {
	    document.getElementById('message').innerHTML = "";
	    /*
	    try {
	        var parsedResult = JSON.parse(resultat.Data[0]);
	    }
	    catch (err) {
	        alert('erreur dans le ShowNewsLetterCallback');
	    }
        */


	    var id = '';
	    var name = '';
	    var subscribe = '';
	    var liste = '';
	    var description = '';
	    var checked = '';
	    /*
	    for (i = 0; i < parsedResult.length; i++) {
	        id = parsedResult[i].ID;
	        name = parsedResult[i].Name;
	        subscribe = parsedResult[i].Subscribe;

	        if (subscribe == "1") {
	            if (document.getElementById('cyberlettre-' + id)) {
	                document.getElementById('cyberlettre-' + id).checked = true;
	            }
	        }
	    }*/
	    document.getElementById('listeCyberlettre').innerHTML = '<table class="tbl_DataUpdates">' +
                                    '<tbody>' +
                                        '<tr>' +
                                            '<th class="titreCyberlettre">Cyberlettres de ICI.radio-Canada.ca</th>' +
                                        '</tr>';
	    for (i = 0; i < resultat.Data.length; i++) {
	        id = resultat.Data[i].Id;
	        name = resultat.Data[i].DisplayName;
	        subscribe = resultat.Data[i].UserSubscribe;
	        description = resultat.Data[i].Description;


	        /*
	        if (subscribe == "1") {
	            if (document.getElementById('cyberlettre-' + id)) {
	                document.getElementById('cyberlettre-' + id).checked = true;
	            }
	        }
            */
	        if (subscribe) {
	            checked = ' checked ';
	        } else {
	            checked = '';
	        }
	        document.getElementById('listeCyberlettre').innerHTML +=
	                                    '<tr>' +
	                                        '<td>' +
	                                            '<p>' +
                                                    '<input type="hidden" id="keyValueCyberlettre-' + i + '" value="' + id + '">' +
	                                                '<input type="checkbox" class="chkb" id="cyberlettre-' + id + '" name="Cyberlettre' + id + '"' + checked + '><label for="Cyberlettre' + id + '">' +
                                                    '   <a href="javascript:toggleDescription(\'Cyberlettre' + id + '\')">' + name + '</a>' +
                                                    '</label><br>' +
                                                    '<span id="Cyberlettre' + id + '_desc" class="descriptor">' +
	                                                    description +
	                                                '</span>' +
	                                            '</p>' +
	                                        '</td>' +
	                                    '</tr>';
	    }

	    document.getElementById('listeCyberlettre').innerHTML += '<br><br><input type="button" class="td_BtnSave" id="btSubmit" value="Enregistrer les changements" name="btSubmit" onclick="RadioCanada.Viafoura.SaveCyberletter();">';

	    document.getElementById('online_customer').style.display = "block";
	},

    //50
    VerifyCommentsListLoaded = function (callback) {
        if (typeof (callback) !== "undefined") {
            //var selectorArticle = RadioCanada.Viafoura.GetElementsByClassNameCrossBrowser("vf-comment-thread");
            //var selectorProfile = RadioCanada.Viafoura.GetElementsByClassNameCrossBrowser("vf-list");
            var selectorProfile = RadioCanada.Viafoura.GetElementsByClassNameCrossBrowser("vf-commenting");

            //if (typeof (selectorArticle) !== "undefined" || typeof (selectorProfile) !== "undefined") {
            if (typeof (selectorProfile) !== "undefined") {
                if (RadioCanada.Viafoura.ModifyCommentsListCalled == false) {
                    callback();
                }
            } else {
                RadioCanada.Viafoura.ModifyCommentsListCalled = false;
            }

            setTimeout(function () {
                RadioCanada.Viafoura.VerifyCommentsListLoaded(callback);
            }, 250);

        }
    },

    //51
    ViafouraLoginPopupLoaded = function (callback) {
        if (typeof (callback) !== "undefined") {
            var selector = RadioCanada.Viafoura.GetElementsByClassNameCrossBrowser("vf-user-login");
            if (typeof (RadioCanada.Viafoura.GetElementsByClassNameCrossBrowser("loginHeader")) !== "undefined") {
                RadioCanada.Viafoura.ViafouraLoginPopupCallbackCalled = false;
            }
            if (typeof (selector) !== "undefined") {
                if (RadioCanada.Viafoura.ViafouraLoginPopupCallbackCalled == false) {
                    //RadioCanada.Viafoura.ViafouraLoginPopupCallbackCalled = true;
                    callback();
                }
            } else {
                RadioCanada.Viafoura.ViafouraLoginPopupCallbackCalled = false;
            }

            setTimeout(function () {
                RadioCanada.Viafoura.ViafouraLoginPopupLoaded(callback);
            }, 250);
        }
    },

    //52
    ViafouraSignupPopupLoaded = function (callback) {

        if (typeof (callback) !== "undefined") {

            var selector = RadioCanada.Viafoura.GetElementsByClassNameCrossBrowser("vf-user-signup");
            if (typeof (RadioCanada.Viafoura.GetElementsByClassNameCrossBrowser("loginHeader")) !== "undefined") {
                RadioCanada.Viafoura.ViafouraSignupPopupCallbackCalled = false;
            }

            if (typeof (selector) !== "undefined") {
                if (RadioCanada.Viafoura.ViafouraSignupPopupCallbackCalled == false) {
                    //RadioCanada.Viafoura.ViafouraSignupPopupCallbackCalled = true;
                    callback();
                }
            } else {
                RadioCanada.Viafoura.ViafouraSignupPopupCallbackCalled = false;
            }

            setTimeout(function () {
                RadioCanada.Viafoura.ViafouraSignupPopupLoaded(callback);
            }, 250);
        }
    },

    ViafouraSettingsPopupLoaded = function (callback) {
        if (typeof (callback) !== "undefined") {

            var selector = RadioCanada.Viafoura.GetElementsByClassNameCrossBrowser("vf-user-profile");

            if (typeof (selector) !== "undefined") {
                if (RadioCanada.Viafoura.ViafouraSettingsPopupCallbackCalled == false) {
                    //RadioCanada.Viafoura.ViafouraSettingsPopupCallbackCalled = true;
                    callback();
                }
            } else {
                RadioCanada.Viafoura.ViafouraSettingsPopupCallbackCalled = false;
            }

            setTimeout(function () {
                RadioCanada.Viafoura.ViafouraSettingsPopupLoaded(callback);
            }, 250);
        }
    }

    //53
    WriteLoginStatus = function (Label) {
        var Label = null;
        if (RadioCanada.Viafoura.ViafouraUser.logged) {
            Label = RadioCanada.Viafoura.ViafouraUser.name;
        }

		ChangeLabel('vf-no-messages', 'There are no comments yet.', '');
		/*
		RadioCanada.Viafoura.GetElementsByClassNameCrossBrowser("vf-rt-toggle vf-tip vf-rt-overlay-color-text active vf-rt-accent-color-background")[0].style.display = "none";
		RadioCanada.Viafoura.GetElementsByClassNameCrossBrowser("vf-realtime vf-comments-realtime vf-rt-main-static")[0].style.display = "none";
		RadioCanada.Viafoura.GetElementsByClassNameCrossBrowser("vf-realtime vf-comments-realtime vf-rt-main-sticky stuck")[0].style.display = "none";
		
		
		
		var tabRealtime = RadioCanada.Viafoura.GetElementsByClassNameCrossBrowser("vf-realtime vf-rt-reply");
		for (var i=0; i<tabRealtime.length; i++) 
		{
			tabRealtime[i].style.display = "none";
		}
		
		*/
		
        if (memberCenterClose) {
            if (document.getElementById("src-nav-login")) {
                document.getElementById("src-nav-login").innerHTML = ('<div id="not-connected"><a title="Me connecter" href="http://www.radio-canada.ca/mesabonnements/mon_profil/index_close.shtml">Me connecter</a></div>');
            }
        }
        else {
            if (RadioCanada.Viafoura.ViafouraOnline) {
                if (document.getElementById("src-nav-login")) {
                    if (RadioCanada.Viafoura.ViafouraUser.logged) {
                        document.getElementById("src-nav-login").innerHTML = ('<div id="connected"><div>ICI <a style="color:#000; text-transform:uppercase; font-size:12px" href="#" onclick="window.viafoura.ui.profile.show(); return false;">' + Label + '</a></div><a title="Me déconnecter" href="#" onclick="window.viafoura.session.logout(); statsToClics(\'clic_action\',\'NavBar_Rouge_SeDeconnecter\',\'clic_contenu\',\'NavBar_Rouge_SeDeconnecter\',\'WT.ti\',\'NavBar_Rouge_SeDeconnecter\')">[Déconnexion]</a></div>');
                    } else {
                        document.getElementById("src-nav-login").innerHTML = ('<div id="not-connected"><a title="Me connecter" href="#" onclick="window.viafoura.ui.login.show(); statsToClics(\'clic_action\',\'NavBar_Rouge_SeConnecter\',\'clic_contenu\',\'NavBar_Rouge_SeConnecter\',\'WT.ti\',\'NavBar_Rouge_SeConnecter\')">Me connecter</a></div>');
                    }
                }
                else {
                    if (!document.getElementById("src-nav-login")) {
                        setTimeout(function () {
                            RadioCanada.Viafoura.WriteLoginStatus();
                        }, 300);
                    }
                }
            }
            else {
                if (document.getElementById("src-nav-login")) {
                    if (RadioCanada.Viafoura.ViafouraUser.logged) {
                        document.getElementById("src-nav-login").innerHTML = ('<div id="connected"><div>ICI ' + Label + '</div><a title="Me déconnecter" href="https://mesabonnements.radio-canada.ca/logout.aspx?redirecturl=http://www.radio-canada.ca/" onclick="statsToClics(\'clic_action\',\'NavBar_Rouge_SeDeconnecter\',\'clic_contenu\',\'NavBar_Rouge_SeDeconnecter\',\'WT.ti\',\'NavBar_Rouge_SeDeconnecter\')">[Déconnexion]</a></div>');
                    } else {
                        document.getElementById("src-nav-login").innerHTML = ('<div id="not-connected"><a title="Me connecter" href="https://inscription.radio-canada.ca/SSOAuthenticationDomain.ashx?mode=login&redirecturl=http://www.radio-canada.ca/" onclick="statsToClics(\'clic_action\',\'NavBar_Rouge_SeConnecter\',\'clic_contenu\',\'NavBar_Rouge_SeConnecter\',\'WT.ti\',\'NavBar_Rouge_SeConnecter\')">Me connecter</a></div>');
                    }
                }
            }
        }
    };

    return {

        BunkerNavBarLogOn: BunkerNavBarLogOn,
        BunkerNavBarLogOut: BunkerNavBarLogOut,
        Get_Cookie: Get_Cookie,
        path: path,
        IncludeViafouraScript: IncludeViafouraScript,
        IncludeLoginBarScript: IncludeLoginBarScript,
        InitEvents: InitEvents,
        Init: Init,
        LoadNewsletter: LoadNewsletter,
        ShowCenterMemberCloseMessage: ShowCenterMemberCloseMessage,
        ShowNewsLetterCallback: ShowNewsLetterCallback,
        ShowCommentsClose: ShowCommentsClose,
        SaveCyberletter: SaveCyberletter,
        SaveCyberletterCallback: SaveCyberletterCallback,
        SaveRciCyberletter: SaveRciCyberletter,
        SaveRciCyberletterCallback: SaveRciCyberletterCallback,
        WriteLoginStatus: WriteLoginStatus,
        AutomaticSetup: AutomaticSetup,
        DrawMonProfil: DrawMonProfil,
        ContentMonProfil: ContentMonProfil,
        ModifySignupWindow: ModifySignupWindow,
        ModifyResetPasswordWindow: ModifyResetPasswordWindow,
        AddVfUniqueIdMetaTag: AddVfUniqueIdMetaTag,
        CommentsClose: CommentsClose,
        GetElementsByClassNameCrossBrowser: GetElementsByClassNameCrossBrowser,
        GetElementsByClassNameCrossBrowserScope: GetElementsByClassNameCrossBrowserScope,
        IncludeCustomViafouraCss: IncludeCustomViafouraCss,
        ViafouraSignupPopupCallbackCalled: ViafouraSignupPopupCallbackCalled,
        ViafouraSettingsPopupLoaded: ViafouraSettingsPopupLoaded,
        ViafouraSignupPopupLoaded: ViafouraSignupPopupLoaded,
        memberCenterClose: memberCenterClose,
        CheckIfMetaExists: CheckIfMetaExists,
        memberCenterClose: memberCenterClose,
        CreateMetaTag: CreateMetaTag,
        ModifyCommentsList: ModifyCommentsList,
        ModifyCommentsListCalled: ModifyCommentsListCalled,
        VerifyCommentsListLoaded: VerifyCommentsListLoaded,
        AppendCustomViafouraCss: AppendCustomViafouraCss,
        ViafouraOnline: ViafouraOnline,
        J50Npi: J50Npi,
        DeleteOptionWithValue: DeleteOptionWithValue,
        ShowLoginForm: ShowLoginForm,
        CheckIfViafouraScriptIsIncluded: CheckIfViafouraScriptIsIncluded,
        ViafouraLoginPopupLoaded: ViafouraLoginPopupLoaded,
        ModifyLoginWindow: ModifyLoginWindow,
        Instruction: Instruction,
        LogCall: LogCall,
		LogConnectionProblem: LogConnectionProblem,
        InitCallback: InitCallback,
        ViafouraUser: ViafouraUser,
        ReloadCallback: ReloadCallback,
        ShowComments: ShowComments,
        GetUpakneeUserId: GetUpakneeUserId,
        GetUpakneeUserIdCallback: GetUpakneeUserIdCallback,
        GetLangue: GetLangue,
        GetUpakneeeLangue: GetUpakneeeLangue,
        ModifySettingsWindow: ModifySettingsWindow,
        ShowMessageToLog: ShowMessageToLog,
        BlockBannedUser: BlockBannedUser,
        LoadWidget: LoadWidget,
        ShowNewsLetter: ShowNewsLetter
    };
}();

document.addEventListener("DOMContentLoaded", function(event) { 
   RadioCanada.Viafoura.Init();
});

RadioCanada.Lib.Mod.oLoginStatus = {

    initLoginStatus: function () {

        if (RadioCanada.Viafoura.ViafouraUser.logged) {
            this.Label = RadioCanada.Viafoura.ViafouraUser.name;
        } else { this.Label = null; return; }
    },
    writeLoginStatus: function () {
        //WriteLoginStatus(this.Label);
    }
}

// Fichier utilisant les mêmes fonctions que Pluck, mais avec le widget de Viafoura 
// Version 1.0.9 


src_drawCommentContent = function (id) {
    // fonction vide 
    if (!RadioCanada.Viafoura.CommentsClose && !RadioCanada.Viafoura.ViafouraOnline) {
        if (isPluckActive === false) return;

        var HTMLBlock = document.getElementById('pluckComments-' + id);

        if (HTMLBlock) {
            var output = '';
            output += '<a name="commentaires"></a>';
            output += '<div id="commentStart"></div>';
            //output += '<div id=avertissementEmbargo class="txtLegalElection">La loi &eacute;lectorale nous interdit de diffuser des r&eacute;sultats &eacute;lectoraux sur Internet avant la fermeture de tous les bureaux de scrutin au pays. Pour cette raison, vous ne pourrez pas publier de commentaires avant 22 h (HAE).</div>';
            output += '<div id=avertissementEmbargo></div>';
            //output += '<div id=avertissementEmbargo class="txtLegalElection">Radio-Canada est pr&eacute;sentement en train de mettre &agrave; jour le syst&egrave;me de gestion des commentaires. Nous pr&eacute;voyons r&eacute;tablir cette fonctionnalit&eacute; sous peu.</div>';	
            //output += 'MESSAGE IMPORTANT<br><br>';
            //output += 'Les tribunes de commentaires ne sont malheureusement pas disponibles pour le moment. <br>';
            //output += 'Nous esp&eacute;rons leur r&eacute;tablissement dans les meilleurs d&eacute;lais.<br>';
            //output += 'Merci de votre compr&eacute;hension!<br><br>';
            //output += 'L\'&eacute;quipe de Radio-Canada.ca<br>';
            output += '<div id="commentTotalTitle"></div>';

            output += '<select id="sortSelect" class="sortSelect" style="display:none;" size="1" onchange="src_sortComments(this, this.options[this.selectedIndex].value);">';
            output += '<option value="descending">Afficher les plus r&eacute;cents</option>';
            output += '<option value="ascending">Afficher les plus anciens</option>';
            output += '<option value="RecommendationsDescending">Les plus appr&eacute;ci&eacute;s</option>';

            output += '</select>';

            if (_450 == true) {
                output += '<p class="code-pertinent">Contributions pertinentes</p>';
            }

            output += '<div class="comment-abuse" id="commentAbuse">';
            output += '<input type="hidden" id="abuseKey" name="abuseKey" value="" />';
            output += '<a href="#" onclick="src_closeAbuseForm(); return false;" class="fermer">X</a>';
            output += '<h3>Signalez un abus</h3>';
            output += '<p>Signalez dans un commentaire : (Requis)</p>';
            output += '<select id="abuseType" name="abuseType" size="1">';
            output += '<option value=""></option>';
            output += '<option value="Propos vulgaires">Propos vulgaires</option>';
            output += '<option value="Propos haineux">Propos haineux</option>';
            output += '<option value="Propos racistes">Propos racistes</option>';
            output += '<option value="Propos sexistes">Propos sexistes</option>';
            output += '<option value="Propos homophobes">Propos homophobes</option>';
            output += '<option value="Attaque personnelle">Attaque personnelle</option>';
            output += '<option value="Publicit&eacute; ind&eacute;sirable">Publicit&eacute; ind&eacute;sirable</option>';
            output += '<option value="Violation de droits d\'auteur / plagiat">Violation de droits d\'auteur / plagiat</option>';
            output += '<option value="Autre">Autre</option>';
            output += '</select>';
            output += '<p>Commentaire : (Facultatif)</p>';
            output += '<textarea id="abuseComment"></textarea>';
            output += '<input type="button" id="abuseSubmit" value="Soumettre" onclick="src_submitAbuse();" />';
            output += '</div>';

            output += '<div id="commentList" class="list-comment"><div id="loadingAnim"><span>Veuillez patienter</span></div></div>';
            //output += '<div id="commentNav"></div>';
            HTMLBlock.innerHTML = output;
        }

    }

};

src_drawFormContent = function (rien) {
    if (!RadioCanada.Viafoura.ViafouraOnline) {
        if (isPluckActive === false) return;
    }
    // fonction vide 
};

src_loadArticle = function (ID, moveToPage, sortingVal, type) {
    // Fonction intégrant le widget de Viafoura 
    articleID = ID;

    if (RadioCanada.Viafoura.CommentsClose) {
        RadioCanada.Viafoura.ShowCommentsClose('pluckComments-0');
    }
    else {
        if (RadioCanada.Viafoura.ViafouraOnline) {
            RadioCanada.Viafoura.ShowComments(articleID);
        }
        else {
            GetPluckJSON(articleID, moveToPage, sortingVal, type);

            if (embargo) {
                showNoCommentLegalNotice();
            }
            else {
                showCommentBox(0);
            }
        }

    }
};
//}

if (RadioCanada.Viafoura.AutomaticSetup) {
    //RadioCanada.Viafoura.Init();
    //RadioCanada.Viafoura.IncludeViafouraScript();
    //RadioCanada.Viafoura.IncludeLoginBarScript();
}



// CODE DU FICHIER s.radio-canada.ca/mp/pluck_article.2.0.2.js 

// *************************************************************************************
// Version 2.0.2.9 de Pluck_article.js utilisant la nouvelle SDK de Pluck pour 450 et Ppage.
// Par Sébastien Mérel
// Radio-canada.ca
// Dernière mise à jour : 12 février 2013
// Dernière modification majeure : Ajout d'une fonction de finission qui s'exécute lorsque les commentaires sont écrits.
// *************************************************************************************



var PluckLib = PluckLib || {};

var commentsPerPage = 10; // Le nombre de commentaires par page.
var commentsMaxLength = 1200; // La longueur maximale qu'un utilisateur peut entrer pour un commentaire. // Un setting chez pluck (CommentLengthLimit ) limite la longueur des commentaires qui leur est envoyé. Le setting local doit être plus petit.
var currentPage = 1; // La page en cours. Cliquer sur "afficher plus" augmente ce int de 1.
var more = false; // Flag si on est sur la première page ou dans un "afficher plus". Si true, n'écrit pas de head/footer aux commentaires.
var backtotop = false; // retourne a l'ancre commentaires lorsque l'on publie un nouveau message.
var fromAnchor = false; // Flag si on a un commentId en paramètre pour ancre vers un commentaire précis.
var endPage = 1; // Le nombre maximal de page à afficher. Si le currentPage = endpage alors il n'y a plus de Paging.
var commentsSorting = 'descending'; // Le orderby par défaut pour les requêtes de CommentsPagesRequests à pluck.
var commentsType = ''; // Le type de page (article, document, discussion, etc.) N'est pas utile pour les CommentsPagesRequests.
var abuseReportMax = 300; // Le nombre maximal de abuse avant de cacher un commentaire.
var isCommentPageEmpty = false; // Debug
var article; // L'objet vide par défaut de l'article. Sera récupéré par CommentsPagesRequest.
var embargo = false; // Flag pour les évènements spéciaux (élections) empêchant les utilisateurs de pouvoir commenter.
var articleID; // Le ID de l'article ex: ghtml-12345
var articleKey; // Le ID de l'article ex: ghtml-12345
var _commentPage; // L'objet contenant les items de la page. Sera remplis par _pluckResponse.
var oDocument = null; // (Obselet)
var oDocumentHead = null; // (Obselet)
var oRCRegionValues = null; // (Obselet)
var oResponse = null; // (Obselet)
var cssLoaded = false; // (obselet)
var agreedArray = new Array(); // Les recommend bidons pour les articles legacy.
var btnClickDisabled = false; // Disable du bouton submit pour empêcher les doublons.
var switchvalueArray = new Array(); // Liste des valeurs à updater.
var currentUserKey = '-1'; // Le userKey identifiant l'utilisateur. Provient soit du cookie de RCID (non-logué) ou du cookie AT (logué).
var currentuserObj; // L'objet sérialisé de l'utilisateur loggé et ses infos.
var currentuserStatus = ''; // Status de l'utilisateur (badges).
var userObj; // L'objet sérialisé de l'utilisateur et ses infos.
var userCompleteName = ""; // Le nom de l'utilisateur logué.
var loggedIn = false; // L'utilisateur est logué ou non.
var ancreLien = ""; // Ancre pour cour
var arrayFlagCount = 0; // Nombre d'action d'update a faire. Chaque update incrémente de 2 : 1- update "positive" ou "negative" 2- set flag.
var flag = 0; // Nombre de flag d'update a true. Si le nombre d'update n'égale pas le nombre de commentaire par page, l'update n'est pas complet.
var messageID;
var problemeModeration = false;
var messagePublic = false;

// Pluck
var oServiceforPluckResponseCall = null; // Objet de requête vers pluck V1 (obselet)
var httpRequestForModuleLoad = null; // Objet de requête vers pluck V1 (obselet)
var domainPrefix = ""; // Identifiant Prod / staging pour l'API utilisant la SDK C# de pluck. 

//var RCPluckSDKEndPoint = "http://pluck.cloudapp.net/ShowComments.aspx"; // lien vers l'api.
//var RCPluckSDKEndPointAddComment = "http://pluck.cloudapp.net/Command.aspx"; // lien vers l'api.

//var RCPluckSDKEndPoint = "http://api.radio-canada.ca/pluck/ShowComments.aspx"; // lien vers l'api.
//var RCPluckSDKEndPointAddComment = "http://api.radio-canada.ca/pluck/Command.aspx"; // lien vers l'api.

var RCPluckSDKEndPoint = "http://api.radio-canada.ca/pluck/v1/ShowComments.aspx"; // lien vers l'api.
var RCPluckSDKEndPointAddComment = "http://api.radio-canada.ca/pluck/v1/Command.aspx"; // lien vers l'api.

//var RCPluckSDKEndPoint = "http://localhost:63267/ShowComments.aspx"; // lien vers l'api.
//var RCPluckSDKEndPointAddComment = "http://localhost:63267/Command.aspx"; // lien vers l'api.
//var RCPluckSDKEndPoint = "http://pp-api.radio-canada.ca/pluck/v1/ShowComments.aspx"; // lien vers l'api.
//var RCPluckSDKEndPointAddComment = "http://pp-api.radio-canada.ca/pluck/v1/Command.aspx"; // lien vers l'api.


//var RCPluckSDKEndPoint = "http://localhost:63267/ShowComments.aspx"; // lien vers l'api.
//var RCPluckSDKEndPointAddComment = "http://localhost:63267/Command.aspx"; // lien vers l'api.



//var RCPluckSDKEndPointCreateLog = "http://e41834e8f7b3476c8034595896495018.cloudapp.net/CreateLog.aspx"; // lien vers l'api.
//var RCPluckSDKEndPointUpdateLog = "http://e41834e8f7b3476c8034595896495018.cloudapp.net/UpdateLog.aspx"; // lien vers l'api.

var _pluckResponse = ""; // Variable contenant la réponse du commentsPageRequest.
var _pluckResponsestatus = ""; // Sert à vérifier dans la réponse de la requête à pluck est un succès ou un échec.

var _pluckReady = false; // Pour les commentaires : Sert à vérifier si la requête a pluck est terminée. Le injectScriptFile valide en boucle cette variable tant qu'elle n'est pas à true.
var _pluckReadyScores = false; // Pour les scores :Sert à vérifier si la requête a pluck est terminée. Le injectScriptFile valide en boucle cette variable tant qu'elle n'est pas à true.
var _pluckReadyAdd = false; // Pour l'ajout de commentaires :Sert à vérifier si la requête a pluck est terminée. Le injectScriptFile valide en boucle cette variable tant qu'elle n'est pas à true.
var _pluckReadyUpdateFlag = false; // Pour l'update des anciens commentaires vers les bons scores. Sera exécuté dans un array pour éviter les clash de requêtes asynchrones.
var _pluckReadyDelete = false; // Effacement d'un message par un admin.

var _serverTime = ""; // L'heure d'un serveur.

// 450
var _450 = false; // Flag qui définit si on est dans le(s) site(s) de 450 pour changements de libellés et d'affichage.
var _phaseoneActivated = false; // Définit certaines options cachées pour la phase 1.
var rc_j = null; // Journalistes.

PluckLib = function () {

    var _ChangeWindowLocation = function (newLocation) {
        window.location.replace(newLocation);
    };


    var _ChangeSharedBarStatusToDisconnected = function () {
        var labelBeforeChange = RadioCanada.Lib.Mod.oLoginStatus.Label;
        // On remet la valeur de l'étiquette à null avant le changement
        RadioCanada.Lib.Mod.oLoginStatus.Label = null;
        // On appelle le script qui effectue le changement de statut
        RadioCanada.Lib.Mod.oLoginStatus.writeLoginStatus();
        // On remet la valeur de l'étiquette à sa valeur d'origine
        RadioCanada.Lib.Mod.oLoginStatus.Label = labelBeforeChange;
    }

    var _GetWindowLocation = function () {
        return window.location.href.toLowerCase();
    };


    var _IsCookieJeunesse = function (pdCookie) {
        // Vérifier si m=jeunesse dans le cookie
        var jeunesseParam = getQueryString("m", pdCookie);
        var isJeunesse = false;
        if (jeunesseParam === "jeunesse") {
            isJeunesse = true;
        }
        return isJeunesse;
    };


    var _IsLogged = function (pdCookie) {

        var log = false;
        if (window.viafoura !== undefined) {
            if (window.viafoura.users.current().id !== undefined) {
                if (window.viafoura.users.current().id !== "undefined") {
                    if (window.viafoura.users.current().id !== 0) {
                        if (window.viafoura.session.current().id !== undefined) {
                            if (window.viafoura.session.current().id !== null) {
                                log = true;
                            }
                        }
                    }
                }
            }
        }

        return log;
    };

    var _InterceptClickOnConnectButton = function () {
        // On va chercher le lien
        var selectorLink = jQuery("#src_nav_login a");
        if (selectorLink.length === 1) {

            // On remplace le lien par un lien vide
            var linkBefore = selectorLink.attr("href");

            // On met la valeur du lien à #
            selectorLink.attr("href", "#");

            // On intercepte le click sur le lien et on
            // supprime les 'cookies' avant de rediriger
            // sur le centre des membres
            selectorLink.click(function () {
                deleteCookie("at");
                deleteCookie("pd");
                // On redirige vers le centre des membres
                PluckLib.ChangeWindowLocation(linkBefore);
            });
        }
    };

    return {
        IsLogged: _IsLogged,
        GetWindowLocation: _GetWindowLocation,
        ChangeSharedBarStatusToDisconnected: _ChangeSharedBarStatusToDisconnected,
        InterceptClickOnConnectButton: _InterceptClickOnConnectButton,
        ChangeWindowLocation: _ChangeWindowLocation,
        IsCookieJeunesse: _IsCookieJeunesse
    };
}();

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Code de base pour l'inject script file afin de récupérer les JSONP de l'API qui fait les requête vers pluck
// Retourne les variables : _article, _pluckReady (ou _pluckReadyScores, ou _pluckReadyAdd), _pluckResponse, user,  _pluckResponsestatus, _serverTime, firstLevelcommentsOnCurrentPage
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getGlobalLookups() {
    if (oDocument === null) {
        oDocument = document;
        oDocumentHead = oDocument.getElementsByTagName("head")[0];
    }
}

function guidGenerator() {
    var S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);

    };
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}
function injectScriptFile(sFilename, isReturnReference) {
    if (typeof (sFilename) === "string") {
        getGlobalLookups();
        var o = oDocument.createElement('script');
        if (o !== null) {
            o.setAttribute("type", "text/javascript");
            o.setAttribute("language", "javascript");
            o.setAttribute("src", sFilename);
            oDocumentHead.appendChild(o);

            if (typeof (isReturnReference) !== "undefined" && isReturnReference === true) {
                return o;
            }
        }
    }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//
// Déclenche le processus de chargement d'une page de commentaire (Est exécuté par défaut au load des pages.)
//function src_loadArticle(ID, moveToPage, sortingVal, type) {

//    articleID = ID;
//GetPluckJSON(articleID, moveToPage, sortingVal, type);

//if (embargo) {
//showNoCommentLegalNotice();
//}
//else {
//  showCommentBox(0);
//}
//}


// Vérifie dans quelle section du site on se trouve.
// Fait l'appel au load du document.
function GetPluckJSON(_articleid, _page, _sorting, _type) {

    if (document.location.href.indexOf("blogues.radio-canada.ca/monteregie") > -1)
        _450 = true;

    if (document.location.href.indexOf("http://blogues.radio-canada.ca/rive-sud") > -1)
        _450 = true;

    if (document.location.href.indexOf("http://blogues.radio-canada.ca/rive-nord") > -1)
        _450 = true;

    if (_450 == true)
        commentsType = "discussion";

    jQuery(document).ready(function () {
        GetPluckJSonDocumentReady(_articleid, _page, _sorting, _type);
    });
}

// Récupère les données utilisateur logué et fait la requête (injectscriptFile) pour récupérer la page de commentaire.
function GetPluckJSonDocumentReady(_articleid, _page, _sorting, _type) {

    var atCookie = Get_Cookie('at');
    var pdCookie = Get_Cookie('pd');
    var RCCookie = Get_Cookie('RCID');

    if (_sorting)
        commentsSorting = _sorting;

    if (_page == null) {
        _page = currentPage;
    } else {
        currentPage = _page;
    }

    articleID = _articleid

    // Vérifie si l'utilisateur est logué et récupère son Id du centre des membres.
    // Si l'utilisateur n'est pas logué on récupère son RCID du profilage de RC et on set le currentUserKey à cette valeur "anonyme"
    if (atCookie) { // If logged, take the thindata ID.
        if (atCookie.length > 0) {
            currentUserKey = atCookie.substring(atCookie.indexOf("u=") + 2, atCookie.indexOf("&"));

            loggedIn = PluckLib.IsLogged(pdCookie);
            if (loggedIn === false) {
                // On débranche l'utilisateur
                PluckLib.ChangeSharedBarStatusToDisconnected();
                PluckLib.InterceptClickOnConnectButton();
            }
        }
    } else {
        loggedIn = false;
        if (RCCookie) {
            if (RCCookie.length > 0) {
                currentUserKey = RCCookie.substring(RCCookie.indexOf("{\"rcid\":") + 8, RCCookie.indexOf(","));
            }
        }
    }
    if (document.getElementById('currentUserKey')) {
        document.getElementById('currentUserKey').value = currentUserKey;
    }

    // Determine si l'utilisateur provient d'une ancre vers un commentaire particulier.
    // Si oui, récupère tous les commentaires et va vers cet ancre.
    var anchor = "";

    if (getQueryString("anchor") != null) {
        anchor = getQueryString("anchor");
        commentsPerPage = 1000;

        if (getQueryString("page") != null) { // Force to get a particular page for an anchor.
            currentPage = getQueryString("page");
            fromAnchor = true;
        }
    }

    var uniquetimestamp = new Date().getTime();

    _pluckReady = false;

    // Requête de la page de commentaire vers l'API interne qui récupère les données de Pluck et les sérialize en JSON.
    oServiceforPluckResponseCall = injectScriptFile(RCPluckSDKEndPoint + "?articleId=" + escape(articleID) + "&numberofcomments=" + commentsPerPage + "&userId=" + currentUserKey + "&displayPage=" + _page + "&sorting=" + commentsSorting + "&type=" + commentsType + "&ts=" + uniquetimestamp, true);

    // Boucle tant que la réponse n'est pas reçue. Quand _pluckReady sera a true on procède à src_renderResponse.
    BouclePourPluckJSONResponse(0, src_renderResponse);


    if (anchor != "") {
        location.hash = anchor; // Si on est dans un anchor, mène l'utilisateur au commentaire visé.
    }
}


// Ces blocs peuvent être optimisés mais pour l'instant c'est un quick fix. Ici on valide des conditions de pluckready différents pour éviter des clash de code ou des problèmes de synchronisation.

// COMMENTS : Boucle tant que la réponse n'est pas reçue. Quand _pluckReady sera a true on procède à src_renderResponse.
function BouclePourPluckJSONResponse(iTimeElapsed, successHandler) {
    if (iTimeElapsed < 0) { iTimeElapsed = 0; };

    if (_pluckReady == false) {
        if (iTimeElapsed <= 25000)
            setTimeout("BouclePourPluckJSONResponse(" + (iTimeElapsed + 100) + ", " + successHandler + ")", 100);
    } else {
        _pluckReady = false;
        successHandler();
    }
}

// SCORES : Boucle tant que la réponse n'est pas reçue. Quand _pluckReadyScores sera a true on procède à src_renderResponse.
function BouclePourPluckJSONResponseScores(iTimeElapsed, successHandler) {
    if (iTimeElapsed < 0) { iTimeElapsed = 0; };

    if (_pluckReadyScores == false) {
        if (iTimeElapsed <= 25000)
            setTimeout("BouclePourPluckJSONResponseScores(" + (iTimeElapsed + 100) + ", " + successHandler + ")", 100);
    } else {
        _pluckReadyScores = false;
        successHandler();
    }
}

// DELETE : Boucle tant que la réponse n'est pas reçue. Quand _pluckReadyScores sera a true on procède à src_renderResponse.
function BouclePourPluckJSONResponseDelete(iTimeElapsed, successHandler) {
    if (iTimeElapsed < 0) { iTimeElapsed = 0; };

    if (_pluckReadyDelete == false) {
        if (iTimeElapsed <= 25000)
            setTimeout("BouclePourPluckJSONResponseDelete(" + (iTimeElapsed + 100) + ", " + successHandler + ")", 100);
    } else {
        _pluckReadyDelete = false;
        successHandler();
    }
}

// ADD COMMENT : Boucle tant que la réponse n'est pas reçue. Quand _pluckReadyAdd sera a true on procède à src_renderResponse.
function BouclePourPluckJSONResponseAddcomment(iTimeElapsed, successHandler) {
    if (iTimeElapsed < 0) { iTimeElapsed = 0; };

    if (_pluckReadyAdd == false) {
        if (iTimeElapsed <= 25000)
            setTimeout("BouclePourPluckJSONResponseAddcomment(" + (iTimeElapsed + 100) + ", " + successHandler + ")", 100);
    } else {
        _pluckReadyAdd = false;
        successHandler();
    }
}

// Update flag to set : Boucle tant que la réponse n'est pas reçue. Quand _pluckReadyUpdateFlag sera a true on procède à src_renderResponse.
function BouclePourPluckJSONResponseUpdate(iTimeElapsed, successHandler) {
    if (iTimeElapsed < 0) { iTimeElapsed = 0; };

    if (_pluckReadyUpdateFlag == false) {
        if (iTimeElapsed <= 25000)
            setTimeout("BouclePourPluckJSONResponseUpdate(" + (iTimeElapsed + 100) + ", " + successHandler + ")", 100);
    } else {
        _pluckReadyUpdateFlag = false;
        successHandler();
    }
}

// Est exécuté lorsque la réponse de pluck et de l'api ont été reçues (donc json complet)
function src_renderResponse() {
    if (isPluckActive === false) return;

    if (_pluckResponse != "") {


        src_renderArticleComments(article, agreedArray);
        src_renderWithUser();

        //src_renderDisapprovals(_pluckResponse);

        //src_renderCommentRecommendationStatus(agreedArray);

        // Determine si l'utilisateur provient d'une ancre vers un commentaire particulier.
        // Si oui, récupère tous les commentaires et va vers cet ancre.
        var anchor = "";

        if (getQueryString("anchor") != null) {
            anchor = getQueryString("anchor");
            commentsPerPage = 1000;

            if (getQueryString("page") != null) { // Force to get a particular page for an anchor.
                currentPage = getQueryString("page");
                fromAnchor = true;
            }
        }

        if (anchor != "") {
            location.hash = "";
            location.hash = anchor; // Si on est dans un anchor, mène l'utilisateur au commentaire visé.
        } else {
            if (backtotop == true) {
                backtotop = false;
                location.hash = "";
                location.hash = "commentaires";
            }
        }
    }
}


// Fait l'appel de l'affichage des commentaires. src_displayCommentsList(_pluckResponse);
// Valide si c'est une première page ou si on a cliqué sur "afficher plus de commentaires"
function src_renderArticleComments(article) {

    if (isPluckActive === false) return;

    _pluckReady = false;

    if (more == false) { //Operation seulement pour la premiere page a charger.
        more = true;

        document.getElementById('commentList').innerHTML = "<div id='innerCommentPage'></div><div id='innerShowMorePage'></div>"; //Containing Div

        src_displayCommentsTotal(article);
        src_displayCommentsList(_pluckResponse);


        //Display divs
        if (!isCommentPageEmpty) {
            document.getElementById('sortSelect').style.display = 'block';
            document.getElementById('commentTotalTitle').style.display = 'block';
            //document.getElementById('commentNav').style.display = 'block';
        }
        document.getElementById('commentForm').style.display = 'block';

        if (_450 == true) {
            document.getElementById('commentDisplayText').innerHTML = 'Contribuez &agrave;' + src_returnCommentTitle();
        } else {
            document.getElementById('commentDisplayText').innerHTML = 'Participez &agrave;' + src_returnCommentTitle();
        }

    } else {
        src_displayCommentsList(_pluckResponse);
    }
}

// Boucle dans les commentaires et bâtis le HTML pour l'affichage selon son niveau/thread/auteur.
function src_displayCommentsList(commentPage) {

    if (isPluckActive === false) return;

    if (user != null && user != "") {
        currentuserObj = eval("(" + user + ")");
    }

    // Nettoie les variables pour prochain appel de page.
    //_pluckResponse = "";
    _pluckReady = false;

    if (firstLevelcommentsOnCurrentPage == 0) {
        if (_pluckResponse.indexOf("Error") > -1) {
            // Section pour les logs des erreurs de serveur de Pluck.
            var StatsUse = 1;
            var StatsProfil = "Logs_pluck";
            statsToClics('clic_action', 'Erreur_Reponse_Pluck_' + _pluckResponse, 'clic_contenu', _serverTime + "_" + document.location.href, 'WT.ti', 'Erreur_Reponse_Pluck_' + _pluckResponse + "-" + _serverTime + "_" + document.location.href);
        }
    }

    var html = "";
    var comment;

    var HTMLBlock = document.getElementById('innerCommentPage'); //Containing Div

    if (commentPage.Items.length < 1) {
        isCommentPageEmpty = true;
    } else {
        isCommentPageEmpty = false;

        if (commentPage.Items) {
            if (commentPage.Items.length > 0) {
                src_embedNavigation(firstLevelcommentsOnCurrentPage, commentsPerPage);
            }
        }

        if (user) {
            currentuserObj = eval("(" + user + ")");

            if (currentuserObj) {
                if (currentuserObj.AwardStatus) {
                    if (currentuserObj.AwardStatus.Badges) {
                        if (currentuserObj.AwardStatus.Badges.length > 0) {
                            //alert(currentuserObj.AwardStatus.Badges[0].Name);
                            if (currentuserObj.AwardStatus.Badges[0].Name == 'Journaliste') {
                                currentuserStatus = 'Journaliste';
                            }
                        }
                    }
                }
            }
        }


        for (var i = 0; i < commentPage.Items.length; i++) {

            comment = commentPage.Items[i];

            var Threaddeepness = "";
            if (comment.ThreadDepth > 1) //var Threaddeepness = ((comment.ThreadDepth -1) * 20);
                Threaddeepness = " response";

            var Threading = '<div id="commentbackgroundDiv:' + comment.CommentKey.Key + '" class="comment-news' + Threaddeepness + '">'; // Définit si la commentaire est un reply

            if (_450 == true) {
                if (comment.ScoreData[3]) {
                    if (comment.ScoreData[3].DeltaScore > 0) {
                        Threading = '<div id="commentbackgroundDiv:' + comment.CommentKey.Key + '" class="comment-news' + Threaddeepness + ' hilight">'; // Définit si le commentaire est un hilight de journaliste.
                    }
                }
            }

            var Threadingend = '</div">';

            var RCUserLogo = "";
            var RCBrand = "";

            //Do not show comment if : reported abuse more than max, author is blocked, comment is blocked.
            if (comment.Owner.AbuseCounts.AbuseReportCount < abuseReportMax && comment.Owner.IsBlocked === false && comment.ContentBlockingState == 0) {

                html += Threading;

                // Récupère le badge du journaliste ayant écrit le message en cours de traitement.
                if (_450 == true) {
                    if (comment.Owner.AwardStatus.Badges.length > 0) {
                        if (comment.Owner.AwardStatus.Badges[0].Name == "Journaliste") { RCUserLogo = ' journaliste'; RCBrand = " de Radio-Canada" }
                        if (comment.Owner.AwardStatus.Badges[0].Name == "Contribueur") { RCUserLogo = ' contribueur' }
                    }
                }


                // Valide l'utilisateur logué comme journaliste.
                var options = "";
                if (rc_j != null) {
                    if (rc_j == "true") {
                        options = "true";
                    }
                }

                // Récupération du nom, prénom et ville et nettoyage des caractères illégaux.
                var _userInfo = getUserInfo(comment); //userObj.ExtendedProfile["First Name"] + " " + _userObj.ExtendedProfile["Last Name"]; //getUserInfo(comment);
                if (_450 == true) {
                    if (comment.Owner.AwardStatus.Badges.length > 0) {
                        if (comment.Owner.AwardStatus.Badges[0].Name == "Journaliste") {
                            var _userInfo = getJournalisteInfo(comment); //userObj.ExtendedProfile["First Name"] + " " + _userObj.ExtendedProfile["Last Name"]; //getUserInfo(comment);
                        }
                    }
                }

                _userInfo = unescape(escape(_userInfo).replace(/%00/g, "")); //  Enleve les caracteres NULL (??? ils sortent de ou? de Pluck?);

                // Delete un message.
                if (_450 == true) {
                    if (currentuserStatus == 'Journaliste') {

                        html += '<a href="javascript:;" class="delete-comment" onclick="javascript:src_deleteMessage(\'' + comment.CommentKey.Key + '\'); return false;" title="Supprimer la contribution">x</a>';

                        //html += '<li class="hilight" id="DeleteMessageDiv:' + comment.CommentKey.Key + '">';
                        //html += '<a href="javascript:;" id="DeleteMessage:' + comment.CommentKey.Key + '" onclick="javascript:src_deleteMessage(\'' + comment.CommentKey.Key + '\'); return false;">Delete</a>';
                        //html += '</li>';
                    }
                }

                // Nom de l'auteur et particules (logo journaliste et Radio-canada)
                html += '<p class="comment-author' + RCUserLogo + '">Envoy&eacute; par <a name="' + comment.CommentKey.Key + '" id="' + comment.CommentKey.Key + '" href="https://mesabonnements.radio-canada.ca/ViewMember.aspx?u=' + comment.Owner.UserKey.Key + '&HasKey=1" target="_blank">';

                html += _userInfo;
                html += RCBrand;
                html += '</p>';

                var textWithReplyToForDate = "";
                var commentBody = comment.Body;

                if (commentBody.indexOf("%from%") > -1) {
                    textWithReplyToForDate = commentBody.substring(commentBody.indexOf("%from%"), commentBody.indexOf("%/from%") + 8);
                    commentBody = commentBody.replace(textWithReplyToForDate, "");

                    // En réponse : Ajout de l'italique et de l'espace à la variable.
                    textWithReplyToForDate = "&nbsp;<em>" + textWithReplyToForDate + "</em></p>";

                    // En réponse : Retrait de la fausse balise au body original.
                    textWithReplyToForDate = textWithReplyToForDate.replace("%/from% ", "");
                    textWithReplyToForDate = textWithReplyToForDate.replace("%/from%", "");
                    textWithReplyToForDate = textWithReplyToForDate.replace("%from%", "");
                }


                if (commentBody.indexOf("a ecrit:") > -1) {
                    commentBody = commentBody.substring(commentBody.indexOf("a ecrit:") + 9);
                }

                // En réponse : Ajout du texte après la date et l'heure.
                html += '<p class="comment-posted">' + src_formatDateTime(comment.PostedAtTime) + textWithReplyToForDate;

                // Ajout de l'ancre pour les journalistes.
                // EX : http://blogues.radio-canada.ca/monteregie/2011/11/22/lorem-ipsum?anchor=CommentKey:739d7cce-cea0-43ab-9ca4-c5eb3762e762#CommentKey:739d7cce-cea0-43ab-9ca4-c5eb3762e762
                ancreLien = document.location.href;
                ancreLien = ancreLien.substr(0, ancreLien.indexOf("#"));
                ancreLien = ancreLien.substr(0, ancreLien.indexOf("?")) + '?anchor=' + comment.CommentKey.Key;

                if (currentuserStatus == 'Journaliste') {
                    html += '<p><a href=' + ancreLien + '>' + ancreLien + '</a>';
                }

                html += '<p class="comment-body">' + testParagrahe(commentBody) + '</p>';

                //Recommend comment link
                html += '<ul class="choix-recommendation">';

                // Si le commentaire est un premier niveau on ajoute le bouton de reply. Mettre en commentaire la validation pour avoir le bouton de reply partout.
                var replyButton = "";
                if (comment.ThreadDepth == 1) {
                    replyButton = '<li class="repondre"><a href="#commenter" onclick="javascript:src_submitCommentInThread(\'' + comment.CommentKey.Key + '\', \'' + _userInfo + '\');">R&eacute;pondre</a></li>';
                }
                html += replyButton;


                if (comment.RecommendationCounts.CurrentUserHasRecommended === false) {
                    agreedArray.push(comment.CommentKey.Key); //Push in CommentKey into Array to parse later
                }

                // Hilight sur le scoreid "Hilight" Si on est journaliste.
                if (_450 == true) {
                    if (currentuserStatus == 'Journaliste') {
                        if (comment.ScoreData[3]) {
                            if (comment.ScoreData[3].CurrentUserHasScored === false) {
                                html += '<li class="hilight" id="HilightCountDiv:' + comment.CommentKey.Key + '">';
                                html += '<a href="javascript:;" id="hilight:' + comment.CommentKey.Key + '" onclick="javascript:src_submithilight(\'' + comment.CommentKey.Key + '\', \'' + Threaddeepness + '\'); return false;">Hilight</a>';
                                html += '</li>';
                            } else {
                                html += '<li class="hilight" id="HilightCountDiv:' + comment.CommentKey.Key + '">';
                                html += '<a href="javascript:;" class="inactif" id="Hilight:' + comment.CommentKey.Key + '" onclick="javascript:src_submitundohilight(\'' + comment.CommentKey.Key + '\', \'' + Threaddeepness + '\'); return false;">Hilight</a>';
                                html += '</li>';
                            }
                        }
                    }
                }

                // Bouton Pertinent seulement pour le projet 450
                //if (_450 == true) {

                // Recommend sur le scoreid "recommend"
                if (comment.ScoreData[1].CurrentUserHasScored === false) {
                    html += '<li class="pertinent" id="RecommendCountDiv:' + comment.CommentKey.Key + '">';
                    html += '<a href="javascript:;" id="Recommendation:' + comment.CommentKey.Key + '" onclick="javascript:src_submitRecommend(\'' + comment.CommentKey.Key + '\', \'' + comment.ScoreData[1].PositiveCount + '\'); return false;">Pertinent</a>';
                    html += '<div class="nb-comments">' + comment.ScoreData[1].PositiveCount + '</div>';
                    html += '</li>';
                } else {
                    html += '<li class="pertinent" id="RecommendCountDiv:' + comment.CommentKey.Key + '">';
                    html += '<a href="javascript:;" class="inactif" id="Recommendation:' + comment.CommentKey.Key + '">Pertinent</a>';
                    html += '<div class="nb-comments">' + comment.ScoreData[1].PositiveCount + '</div>';
                    html += '</li>';
                }
                //}


                var positivescorestring = comment.ScoreData[2].PositiveCount;
                var negativesscorestring = comment.ScoreData[2].NegativeCount;

                // Validation si le commentaire a ete update pour les valeurs positives provenant du recommend.
                // comment.scoredata[0] est le flag, si c'est a 0 c'est que le transfert n'a pas ete fait.
                // Les scores positifs du recommend iront dans comment.scoredata[2].positivescore.
                if (comment.ScoreData[0].PositiveCount == 0) {

                    // Update action seulement s'il y a des recommend (vieil article)
                    if (comment.RecommendationCounts.NumberOfRecommendations > 0) {

                        switchvalueArray.push(new Array());
                        switchvalueArray[(switchvalueArray.length - 1)].push("positive");
                        switchvalueArray[(switchvalueArray.length - 1)].push(comment.CommentKey.Key);
                        switchvalueArray[(switchvalueArray.length - 1)].push(comment.RecommendationCounts.NumberOfRecommendations);
                    }

                    // Flag Set
                    switchvalueArray.push(new Array());
                    switchvalueArray[(switchvalueArray.length - 1)].push("flag");
                    switchvalueArray[(switchvalueArray.length - 1)].push(comment.CommentKey.Key);
                    switchvalueArray[(switchvalueArray.length - 1)].push("1");

                }

                // Vieux Recommend et Vieux Not Recomment. PAS VISIBLE, POUR TRANSFERT SEULEMENT
                html += '<div style="display:none;">';
                html += '   <div id="RecommendLabel:' + comment.CommentKey.Key + '"></div>'; //DO NOT REMOVE!!!
                html += '   <span id="RecommendCount:' + comment.CommentKey.Key + '">' + comment.NumberOfRecommendations + '</span>';
                html += '   <div id="DisapproveLabel:CommentArticle:' + comment.CommentKey.Key + '"></div>'; //DO NOT REMOVE!!!
                html += '   <a class="disapprove" id="DisapproveThumbImg:CommentArticle:' + comment.CommentKey.Key + '" href="#" onclick="javascript:src_submitDisapproval(\'' + comment.CommentKey.Key + '\'); return false;">';
                html += '   En d&eacute;saccord (<span id="DisapproveCount:CommentArticle:' + comment.CommentKey.Key + '">0</span>)';
                html += '   &raquo;</a>';
                html += '   <div id="DecisionLabel:' + comment.CommentKey.Key + '" class="approvalValid"></div>';
                html += '</div>';


                if (comment.ScoreData[2].CurrentUserHasScored === false) {
                    html += '<li class="accord" id="ApproveCountDiv:' + comment.CommentKey.Key + '">';
                    html += '<a href="javascript:;" id="RecommendThumbImg:' + comment.CommentKey.Key + '" onclick="javascript:src_submitApproval(\'' + comment.CommentKey.Key + '\', \'' + positivescorestring + '\',\'' + negativesscorestring + '\'); return false;">En accord</a>';
                    html += '<div class="nb-comments">' + positivescorestring + '</div>';
                    html += '</li>';
                } else {
                    html += '<li class="accord" id="ApproveCountDiv:' + comment.CommentKey.Key + '">';
                    html += '<a href="javascript:;" class="inactif" id="RecommendThumbImg:' + comment.CommentKey.Key + '">En accord</a>';
                    html += '<div class="nb-comments">' + positivescorestring + '</div>';
                    html += '</li>';
                }

                // Ce resultat est uniquement dans le cas ou on utilise le bidon recommend
                if (comment.ScoreData[2].CurrentUserHasScored === false) {
                    html += '<li class="desaccord" id="DisapproveCountDiv:' + comment.CommentKey.Key + '">';
                    html += '<a href="javascript:;" id="RecommendThumbImg:' + comment.CommentKey.Key + '" onclick="javascript:src_submitDisapproval(\'' + comment.CommentKey.Key + '\', \'' + negativesscorestring + '\',\'' + positivescorestring + '\'); return false;">En d&eacute;saccord</a>';
                    html += '<div id=\"DisapproveCountVisible:CommentArticle:' + comment.CommentKey.Key + '"\" class="nb-comments">' + negativesscorestring + '</div>';
                    html += '</li>';
                } else {
                    html += '<li class="desaccord" id="DisapproveCountDiv:' + comment.CommentKey.Key + '">';
                    html += '<a href="javascript:;" class="inactif" id="RecommendThumbImg:' + comment.CommentKey.Key + '">En d&eacute;saccord</a>';
                    html += '<div id=\"DisapproveCountVisible:CommentArticle:' + comment.CommentKey.Key + '"\" class="nb-comments">' + negativesscorestring + '</div>';
                    html += '</li>';
                }

                //Report abuse

                // Partager TODO!
                if (_phaseoneActivated == true) {
                    html += '<li class="partager"><a href="javascript:;" onclick="javascript:alert(\'' + location.href + '?page=' + currentPage + '#' + comment.CommentKey.Key + '\');">partagez</a></li>';
                }

                if (comment.CurrentUserHasReportedAbuse == 'True') {

                    if (_450 == true) {
                        html += '<span id="AbuseAction:' + comment.CommentKey.Key + '" class="reported">Cette contribution a &eacute;t&eacute; signal&eacute;e</span>';
                    } else {
                        html += '<span id="AbuseAction:' + comment.CommentKey.Key + '" class="reported">Ce commentaire a &eacute;t&eacute; signal&eacute;</span>';
                    }

                } else {
                    if (!sectionLimitee()) {
                        html += '<li class="moderateur"><a href="#' + comment.CommentKey.Key + '" id="AbuseAction:' + comment.CommentKey.Key + '" onclick="src_openAbuseForm(this, \'' + comment.CommentKey.Key + '\'); return false;">Signalez un abus</a></li>';
                    }
                }
                html += '</ul>';


                html += '</div>';
                html += '</div>';

                html += Threadingend;

            }

                //Comment has been blocked by moderators
            else if (comment.ContentBlockingState != 'Unblocked') {
                html += '<div class="comment-news">';
                html += '<p class="comment-author">Envoy&eacute; par un utilisateur non divulgu&eacute;</p>';
                html += '<p class="comment-posted">' + src_formatDateTime(comment.PostedAtTime) + '</p>';
                //html += '<div class="commentBody"><p>Ce commentaire est consid&eacute;r&eacute; comme non pertinent et a &eacute;t&eacute; retir&eacute;.</p></div>';

                if (_450 == true) {
                    html += '<p class="comment-body">"Cette contribution a &eacute;t&eacute; supprim&eacute;e car elle ne respectait pas la <a href="javascript:;" onclick="openPopup(\'http://www.radio-canada.ca/apropos/conditionsutilisation/netiquette/popUp.shtml\', 600,500, \'yes\'); return false;">n&eacute;tiquette</a>.</p>';
                } else {
                    html += '<p class="comment-body">Ce commentaire a &eacute;t&eacute; retir&eacute; par le mod&eacute;rateur car il ne respectait pas la <a href="javascript:;" onclick="openPopup(\'http://www.radio-canada.ca/apropos/conditionsutilisation/netiquette/popUp.shtml\', 600,500, \'yes\'); return false;">n&eacute;tiquette</a>.</p>';
                }

                "Cette contribution a &eacute;t&eacute; supprim&eacute;e car elle ne respectait pas la Netiquette."

                html += '</div>';
            }

        }
    }

    if (commentPage.Items.length <= 0) {
        // Si il n'a a pas de commentaires
        jQuery('#pluckComments-0').hide();
    }

    //HTMLBlock.innerHTML = html; // OLD VERSION : ALLOW ONLY 1 PAGE AT A TIME, NEW VERSION ADDS PAGES AT THE BOTTOM OF THE LIST WHEN 'MORE' IS CLICKED.
    HTMLBlock.innerHTML += html;
}

function testParagrahe(texte) {
    texte = texte.replace(/\n/g, '<br>');
    return texte;
}


/////////////////////////////
//Comments approval handeling
function src_submitApproval(key, count, oppositecount) {
    if (isPluckActive === false) return;
    oServiceforPluckResponseCall = injectScriptFile(RCPluckSDKEndPointAddComment + "?command=ApproveComment&articleId=" + escape(articleID) + "&commentId=" + key + "&userid=" + currentUserKey, true);
    BouclePourPluckJSONResponseScores(0, src_renderSubmitRecommendation);

    document.getElementById("ApproveCountDiv:" + key).innerHTML = "<a href=\"javascript:;\" class=\"inactif\">En accord </a><div class=\"nb-comments\">" + (eval(count) + 1) + "</div>";
    document.getElementById("DisapproveCountDiv:" + key).innerHTML = "<a href=\"javascript:;\" class=\"inactif\">En d&eacute;saccord </a><div class=\"nb-comments\">" + oppositecount + "</div>";
}

function src_submitDisapproval(key, count, oppositecount) {
    if (isPluckActive === false) return;
    oServiceforPluckResponseCall = injectScriptFile(RCPluckSDKEndPointAddComment + "?command=DissapproveComment&articleId=" + escape(articleID) + "&commentId=" + key + "&userid=" + currentUserKey, true);
    BouclePourPluckJSONResponseScores(0, src_renderSubmitDisapprovalComplete);

    document.getElementById("DisapproveCountDiv:" + key).innerHTML = "<a href=\"javascript:;\" class=\"inactif\">En d&eacute;saccord </a><div class=\"nb-comments\">" + (eval(count) + 1) + "</div>";
    document.getElementById("ApproveCountDiv:" + key).innerHTML = "<a href=\"javascript:;\" class=\"inactif\">En accord </a><div class=\"nb-comments\">" + oppositecount + "</div>";
}

function src_submitRecommend(key, count) {
    if (isPluckActive === false) return;
    oServiceforPluckResponseCall = injectScriptFile(RCPluckSDKEndPointAddComment + "?command=recommend&articleId=" + escape(articleID) + "&commentId=" + key + "&userid=" + currentUserKey, true);
    BouclePourPluckJSONResponseScores(0, src_renderSubmitRecommendComplete);

    document.getElementById("RecommendCountDiv:" + key).innerHTML = "<a href=\"javascript:;\" class=\"inactif\">Pertinent </a><div class=\"nb-comments\">" + (eval(count) + 1) + "</div>";
}

function src_submithilight(key, deep) {
    if (isPluckActive === false) return;
    oServiceforPluckResponseCall = injectScriptFile(RCPluckSDKEndPointAddComment + "?command=hilight&articleId=" + escape(articleID) + "&commentId=" + key + "&userid=" + currentUserKey, true);
    BouclePourPluckJSONResponseScores(0, src_renderSubmitRecommendComplete);

    document.getElementById("HilightCountDiv:" + key).innerHTML = "<a href=\"javascript:;\" class=\"inactif\">Hilight </a>";
    document.getElementById("commentbackgroundDiv:" + key).className = "comment-news " + deep + " hilight";
}

function src_submitundohilight(key, deep) {
    if (isPluckActive === false) return;
    oServiceforPluckResponseCall = injectScriptFile(RCPluckSDKEndPointAddComment + "?command=dissapprovecomment&scoreId=hilight&articleId=" + escape(articleID) + "&scoreCount=1&commentId=" + key + "&userid=" + currentUserKey, true);
    BouclePourPluckJSONResponseScores(0, src_renderSubmitRecommendComplete);

    document.getElementById("HilightCountDiv:" + key).innerHTML = "<a href=\"javascript:;\" class=\"actif\">Hilight </a>";
    document.getElementById("commentbackgroundDiv:" + key).className = "comment-news " + deep;
}

function src_deleteMessage(key) {
    if (confirmDelete(key) === true) {
        oServiceforPluckResponseCall = injectScriptFile(RCPluckSDKEndPointAddComment + "?command=deletemsg&articleId=" + escape(articleID) + "&commentId=" + key + "&userid=" + currentUserKey, true);
        BouclePourPluckJSONResponseDelete(0, src_renderdeleteComplete);
    } else {
        return false;
    }
}

function confirmDelete(key) {
    if (confirm("Vous allez effacer cette contribution : " + key)) {
        return true;
    } else {
        return false;
    }
}

function src_renderdeleteComplete() {
    alert("La contribution est effac\u00E9e");
}

function src_renderSubmitRecommendComplete() {
    //ToDo
}

// D'accord
function src_renderSubmitRecommendation() {
    if (isPluckActive === false) return;
    // TO DO
}

// Désaccord
function src_renderSubmitDisapprovalComplete(responseBatch) {
    if (isPluckActive === false) return;
    // TO DO
}

// Pertinent
function src_renderRecommendationDisplay(thisComment) {
    if (isPluckActive === false) return;
    // TO DO
}

//Switch les recommend du commentaire pour des positives scores ou les negativescore.
// Le successhandler (migreRecommendToScores) est une fonction qui va appeler automatiquement l'update suivant du array. 
function UpdateValeurRecommendations(key, action, count) {

    if (action == "positive") {
        oServiceforPluckResponseCall = injectScriptFile(RCPluckSDKEndPointAddComment + "?command=updatepositivescore&articleId=" + escape(articleID) + "&scoreCount=" + count + "&scoreId=thumbs&commentId=" + key + "&userid=1", true);
        BouclePourPluckJSONResponseUpdate(0, migreRecommendToScores);
    }
    if (action == "negative") {
        oServiceforPluckResponseCall = injectScriptFile(RCPluckSDKEndPointAddComment + "?command=updatenegativescore&articleId=" + escape(articleID) + "&scoreCount=" + count + "&scoreId=thumbs&commentId=" + key + "&userid=2", true);
        BouclePourPluckJSONResponseUpdate(0, migreRecommendToScores);
    }
    if (action == "flag") {
        oServiceforPluckResponseCall = injectScriptFile(RCPluckSDKEndPointAddComment + "?command=updateflagscore&articleId=" + escape(articleID) + "&scoreCount=" + count + "&scoreId=flag&commentId=" + key + "&userid=2", true);
        BouclePourPluckJSONResponseUpdate(0, migreRecommendToScores);
    }
}

function src_renderDisapprovalDisplay(thisArticle) {
    if (isPluckActive === false) return;

    if (thisArticle && thisArticle.ArticleKey && thisArticle.ArticleKey.Key) {
        var thisArticleKeyObj = thisArticle.ArticleKey;
        var thisArticleKeyStr = thisArticle.ArticleKey.Key;
        var thisCommentKeyStr = thisArticleKeyStr.substr(15, thisArticleKeyStr.length);
        var theDisapprovalThumbImgDiv = document.getElementById('DisapproveThumbImg:' + thisArticleKeyStr);
        var theDisapprovalLabelDiv = document.getElementById('DisapproveLabel:' + thisArticleKeyStr);
        var theDisapprovalCountSpan = document.getElementById('DisapproveCount:' + thisArticleKeyStr);

        if (theDisapprovalThumbImgDiv && (thisArticle.Ratings.CurrentUserRating != '0')) {
            var newDiv = document.createElement('div');
            newDiv.id = 'DisapproveLabel:' + thisArticleKeyStr;
            newDiv.className = 'disapprove disapproveChk';
            newDiv.innerHTML = 'En d&eacute;saccord (<span id="DisapproveCount:' + thisArticleKeyStr + '">' + thisArticle.Ratings.NumberOfRatings + '</span>)';
            theDisapprovalThumbImgDiv.parentNode.removeChild(theDisapprovalThumbImgDiv);
            theDisapprovalLabelDiv.parentNode.insertBefore(newDiv, theDisapprovalLabelDiv);
            theDisapprovalLabelDiv.parentNode.removeChild(theDisapprovalLabelDiv);

            //Decision label
            //src_displayDecisionLabelText(thisCommentKeyStr, false);
        }

        theDisapprovalCountSpan.innerHTML = thisArticle.Ratings.NumberOfRatings;

        // Update score
        switchvalueArray.push(new Array());
        switchvalueArray[(switchvalueArray.length - 1)].push("negative");
        switchvalueArray[(switchvalueArray.length - 1)].push(thisCommentKeyStr);
        switchvalueArray[(switchvalueArray.length - 1)].push(thisArticle.Ratings.NumberOfRatings);

    }
}


//function UpdateLog(message) {
//oServiceforPluckResponseCall = injectScriptFile(RCPluckSDKEndPointUpdateLog + "?messageID=" + messageID + "&message=" + message, true);
//}


//Fonction qu va créer une entrée de log. Cette entrée sera par la suite bonifiée pour chaque action de l'usager et à chaque erreur
//Si une erreur souvient lors de la création du log, un avertissement est envoyé (méthode à déterminer)
//function CreateLog(articleId, userId, username) {
//oServiceforPluckResponseCall = injectScriptFile(RCPluckSDKEndPointCreateLog + "?articleId=" + articleId + "&userId=" + userId + "&username=" + username + "&messageID=" + messageID, true);
//}
//function CreateAdhocLog(name, value) {
//oServiceforPluckResponseCall = injectScriptFile(RCPluckSDKEndPointCreateAdhocLog + "?name=" + name + "&value=" + value, true);
//}

// src_submitComment() : Exécute la préparation et l'envois de nouveau commentaires vers Pluck.
// Fait d'abbord les validations si l'utilisateur est logué
// Valide que le nom de l'utilisateur a été récupéré.
// Fait l'appel au injectScriptFile pour l'envois de la requête à Pluck.
function src_submitComment() {

    messageID = guidGenerator();
    // Remplace le nickname par le nom complet de l'utilisateur.
    //var nickname = replaceUserName();
    userCompleteName = changeIt(userCompleteName);
    //userCompleteName = nickname;
    //nickname = UTF8.encode(nickname);

    //if (userCompleteName == null) { // Valide que l'utilisateur a un nom complet sinon récupère le du cookie AT.
    //currentuserObj = eval("(" + user + ")");
    //userCompleteName = currentuserObj.ExtendedProfile[1].Value + " " + currentuserObj.ExtendedProfile[2].Value;
    //}


    //CreateLog(articleID, currentUserKey, userCompleteName);

    if (isPluckActive === false) return;

    if (btnClickDisabled === false) {

        btnClickDisabled = true;
        backtotop = true;

        var text = document.getElementById('commentText').value;

        if (!sectionLimitee()) {
            text = addNameIntoText(text);
        }

        var checkSignedComments;

        if (!sectionLimitee()) {
            checkSignedComments = document.getElementById('acceptSignedComments');
        }

        if (!sectionLimitee() && !checkSignedComments.checked) { // Verifie si l'utilisateur a coché la case signedcomments.
            alertSignedComments();
            btnClickDisabled = false; // Permet a l'utilisateur de recliquer sur le bouton submit.

        } else {
            if (text == "") { // Verifie si l'utilisateur a laisser la boite de commentaire vide.
                if (_450 == true) {
                    alert('Vous devez entrer une contribution.');
                } else {
                    alert('Vous devez entrer un commentaire.');
                }

                btnClickDisabled = false; // Permet a l'utilisateur de recliquer sur le bouton submit.

            } else {

                if (_450 == true) {
                    //alert("Votre contribution a \u00E9t\u00E9 envoy\u00E9e avec succ\u00E8s.\n\n Elle sera mod\u00E9r\u00E9e avant d'\u00EAtre publi\u00E9e.");
                } else {
                    //alert("Votre commentaire a \u00E9t\u00E9 envoy\u00E9 avec succ\u00E8s.\n\n Il sera mod\u00E9r\u00E9 avant d'\u00EAtre publi\u00E9.");
                }

                var additionalParameters = "";
                var textPourNotification = "";

                var urlApi = "http://api.radio-canada.ca/pluck/command.aspx";

                if (_450 == true) {
                    textPourNotification = document.location.href;
                    textPourNotification = textPourNotification.substr(0, textPourNotification.indexOf("#"));
                    textPourNotification = textPourNotification.substr(0, textPourNotification.indexOf("?")) + 'commentaires';


                    if (document.location.href.indexOf("blogues.radio-canada.ca/rive-sud") > -1) {
                        //additionalParameters = "&450=true&useremail=" + currentuserObj.Email + "&mailjournaliste=sebastien.merel@radio-canada.ca&username=" + encodeURIComponent(userCompleteName);
                        additionalParameters = "&450=true&useremail=" + currentuserObj.Email + "&mailjournaliste=redaction.rivesud@radio-canada.ca&username=" + encodeURIComponent(userCompleteName);
                    }
                    if (document.location.href.indexOf("blogues.radio-canada.ca/rive-nord") > -1) {
                        //additionalParameters = "&450=true&useremail=" + currentuserObj.Email + "&mailjournaliste=sebastien.merel@radio-canada.ca&username=" + encodeURIComponent(userCompleteName);
                        additionalParameters = "&450=true&useremail=" + currentuserObj.Email + "&mailjournaliste=redaction.rivenord@radio-canada.ca&username=" + encodeURIComponent(userCompleteName);
                    }
                    if (document.location.href.indexOf("blogues.radio-canada.ca/monteregie") > -1) {
                        additionalParameters = "&450=true&useremail=" + currentuserObj.Email + "&mailjournaliste=sebastien.merel@radio-canada.ca&username=" + encodeURIComponent(userCompleteName);

                    }
                }

                var title = getDocumentTitle();

                if (_450 == true) {
                    // Fait l'appel de l'ajout du message avec le texte reply to si c'est un comment en thread.
                    if (document.getElementById('ReplyIDHiddenBox').value != "") {
                        text = "%from% en r&eacute;ponse &agrave; " + document.getElementById('replytoNameHiddenBox').value.replace("</a>", "").replace("<%2Fa>", "") + "%/from% " + text;
                        oServiceforPluckResponseCall = injectScriptFile(RCPluckSDKEndPointAddComment + "?articleId=" + articleID + "&command=addcommentInThread&userId=" + currentUserKey + "&responseTo=" + encodeURIComponent(document.getElementById('ReplyIDHiddenBox').value.replace("</a>", "").replace("<%2Fa>", "")) + "&username=" + encodeURIComponent(userCompleteName.replace("</a>", "").replace("<%2Fa>", "")) + "&t=" + encodeURIComponent(text) + "&articleTitle=" + encodeURIComponent(title) + "&articleUrl=" + encodeURIComponent(document.location.href) + additionalParameters + "&anchorlink=" + textPourNotification, true);
                    } else {
                        oServiceforPluckResponseCall = injectScriptFile(urlApi + "?articleId=" + articleID + "&command=addcomment&userId=" + currentUserKey + "&username=" + encodeURIComponent(userCompleteName.replace("</a>", "").replace("<%2Fa>", "")) + "&t=" + encodeURIComponent(text) + "&articleTitle=" + encodeURIComponent(title) + "&articleUrl=" + encodeURIComponent(document.location.href) + additionalParameters + "&anchorlink=" + textPourNotification, true);
                    }
                } else {
                    // Fait l'appel de l'ajout du message avec le texte reply to si c'est un comment en thread.
                    if (document.getElementById('ReplyIDHiddenBox').value != "") {
                        text = "%from% en r&eacute;ponse &agrave; " + document.getElementById('replytoNameHiddenBox').value.replace("</a>", "").replace("<%2Fa>", "") + "%/from% " + text;
                        document.getElementById('commentText').value = text;
                        document.getElementById('command').value = 'addcommentInThread';
                        document.getElementById('responseTo').value = encodeURIComponent(document.getElementById('ReplyIDHiddenBox').value.replace("</a>", "").replace("<%2Fa>", ""));
                        document.getElementById('btnSubmit').innerHTML = 'Envoi en cours...';
                        document.forms["formPluck"].submit();
                        //oServiceforPluckResponseCall = injectScriptFile(RCPluckSDKEndPointAddComment + "?articleId=" + articleID + "&command=addcommentInThread&userId=" + currentUserKey + "&responseTo=" + encodeURIComponent(document.getElementById('ReplyIDHiddenBox').value.replace("</a>", "").replace("<%2Fa>", "")) + "&username=" + encodeURIComponent(userCompleteName.replace("</a>", "").replace("<%2Fa>", "")) + "&t=" + encodeURIComponent(text) + "&articleTitle=" + encodeURIComponent(title) + "&articleUrl=" + encodeURIComponent(document.location.href) + "&anchorlink=" + textPourNotification, true);
                    } else {
                        //oServiceforPluckResponseCall = injectScriptFile(RCPluckSDKEndPointAddComment + "?articleId=" + articleID + "&command=addcomment&userId=" + currentUserKey + "&username=" + encodeURIComponent(userCompleteName.replace("</a>", "").replace("<%2Fa>", "")) + "&t=" + encodeURIComponent(text) + "&articleTitle=" + encodeURIComponent(title) + "&articleUrl=" + encodeURIComponent(document.location.href), true);						
                        //AddComment(articleID, currentUserKey, encodeURIComponent(userCompleteName.replace("</a>", "").replace("<%2Fa>", "")), encodeURIComponent(text), encodeURIComponent(title) , encodeURIComponent(document.location.href));
                        document.getElementById('btnSubmit').innerHTML = 'Envoi en cours...';
                        document.getElementById('commentText').value = text;
                        document.forms["formPluck"].submit();
                    }
                }

                //UpdateLog(encodeURIComponent(text));
                // Boucle pour ajouter le commentaire.				

                BouclePourPluckJSONResponseAddcomment(0, AddCommentCallSuccess);

                // Reset les formulaires et les variables pour le prochain appel.
                document.getElementById('ReplyIDHiddenBox').value = "";
                document.getElementById('replytoNameHiddenBox').value = "";
                document.getElementById('commentText').value = "";
                text = "";
                btnClickDisabled = false;
            }
        }
    }
}

// fonction préparatoire à l'envoir d'un nouveau commentaire dans un THREAD.
// Remplis les hidden text fields avec les valeurs de texte à ajouter au commentaire. 
// Remplis le texte "reponse à" et l'affiche.
function src_submitCommentInThread(_responseToCommentId, _userName) {
    if ((_responseToCommentId != null) && (_userName != null)) {
        document.getElementById('ReplyIDHiddenBox').value = _responseToCommentId;
        document.getElementById('replytoNameHiddenBox').value = _userName;
        document.getElementById('ReplyToRemainder').innerHTML = "<p class='txtLegal'><b>Votre r&eacute;ponse &agrave; la contribution de " + _userName + "</b></p></br>";
    }
}


// Fonction générique pour lire les valeurs d'un cookie du domaine.
function src_readCookie(name) {
    if (isPluckActive === false) return;

    var nameEQ = name + '=';
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}


// fonction qui extrait la valeur du userId du cookie AT du centre des membres (appelle la fonction readcookie('at')
function src_extractUserID() {
    if (isPluckActive === false) return;

    //var userID = src_extractUserID();
    var sCookie = src_readCookie('at');
    if (sCookie != null) {
        var s = sCookie.split('&');
        for (var i = 0; i < s.length; i++) {
            if (s[i].substring('u=', s[i].length))
                return s[i].substring(2, s[i].length);
        }
    }
    return null;
}

// Fonction qui définit si l'utilisateur est logué au centre des membres.
// Écrit le status connecté de l'utilisateur sous forme de texte et de lien
// Définit la variable userCompleteName utilisée pour afficher le nom de l'utilisateur.
function src_renderWithUser() {

    if (isPluckActive === false) return;

    var status = 'nonConnecte';
    var loginLink = document.getElementById('loginLink');
    var commentText = document.getElementById('commentText');
    var submitButton = document.getElementById('btnSubmit');
    var formBtn = document.getElementById('formBtn');
    var confirmSignedComments = document.getElementById('confirmSignedComments');
    var userCompleteName = '';
    var commentText1 = document.getElementById('commentText');

    commentText.disabled = !loggedIn; //Enable/Disable comment form textarea
    submitButton.disabled = !loggedIn; //Enable/Disable comment form submit button
    formBtn.style.display = loggedIn ? 'block' : 'none'; //Enable/Disable comment form submit button

    if (!sectionLimitee()) {
        confirmSignedComments.style.display = loggedIn ? 'block' : 'none';
        commentText1.style.background = loggedIn ? '#F9F9F9' : '#eeeeee';
    }

    if (loggedIn) {
        showConnectedBox();

        if (!sectionLimitee()) {
            var html = 'Vous &ecirc;tes connect&eacute; en tant que <a href="https://mesabonnements.radio-canada.ca/ViewMember.aspx?u=' + currentUserKey + '&HasKey=1" target="_blank">' + currentuserObj.ExtendedProfile[1].Value + " " + currentuserObj.ExtendedProfile[2].Value + '</a>';
            html += '<a class="deconnecter" href="http://inscription-jeunesse.radio-canada.ca/deconnexion" id="ssoLogout" class="ssoLogout btn_jeunesse btn_gris">Se d&eacute;connecter</a>';
        }
        else {
            var html = 'Tu es connect&eacute; en tant que ' + getUserNameConnected(currentuserObj);
            html += '&nbsp;&nbsp;<a href="http://inscription-jeunesse.radio-canada.ca/deconnexion" id="ssoLogout" class="ssoLogout btn_jeunesse btn_gris">D&eacute;connexion<span class="coinDroite"></span></a>';
            if (document.getElementById('sidebarUsername')) {
                document.getElementById('sidebarUsername').innerHTML = getUserNameConnected(currentuserObj);
            }
        }

        loginLink.innerHTML = html;
        status = 'connecte';

        user = eval("(" + user + ")");

        if (!sectionLimitee()) {
            userCompleteName = user.ExtendedProfile[1].Value + " " + user.ExtendedProfile[2].Value;

            if (document.getElementById('username')) {
                document.getElementById('username').value = changeIt(userCompleteName);
            }
        }

    }

    src_pushStats(status); //Compile stats
}

function showConnectedBox() {
    if (document.getElementById('disconnectedUser')) {
        document.getElementById('disconnectedUser').style.display = 'none';
    }
    if (document.getElementById('connectedUser')) {
        document.getElementById('connectedUser').style.display = 'block';
    }
}

function showDisconnectedBox() {
    if (document.getElementById('connectedUser')) {
        document.getElementById('connectedUser').style.display = 'none';
    }
    if (document.getElementById('disconnectedUser')) {
        document.getElementById('disconnectedUser').style.display = 'block';
    }
}

// Fonction utilisée par la barre partagée pour retourner le total des commentaires lié à un article.
function src_displayCommentsTotal(article) {
    if (isPluckActive === false) return;

    if (article) {
        var html = '';
        //Head - Barre partager
        try {
            oSrc.oPlusX.showCommentBtn({ 'n': article.Comments.NumberOfComments });
        }
        catch (err) {
        }
        try {
            showCommentBtn({ 'n': article.Comments.NumberOfComments });
        }
        catch (err) {
        }

        //Title
        if (article.Comments.NumberOfComments > 0) {

            var HTMLBlock = document.getElementById('commentTotalTitle');
            html = '<h2 class="title-block-gradient">';

            if (_450 == true) {
                html += article.Comments.NumberOfComments <= 1 ? 'Vos contributions' : 'Vos contributions';
                html += ' <div class="nb-commentaires">(' + article.Comments.NumberOfComments + ')</div>';
                html += '<a href="#commenter" class="contribuez">Contribuez</a>';
            } else {
                html += article.Comments.NumberOfComments <= 1 ? 'Les commentaires' : 'Les commentaires';
                html += ' <div class="nb-commentaires">(' + article.Comments.NumberOfComments + ')</div>';
                html += '<a href="#commenter" class="participez">Participez</a>';
            }

            html += '</h2>';
            HTMLBlock.innerHTML = html;
        }
    }
}


// Récupère les informations du profil de l'utilisateur actuellement logué.
function getUserNameConnected(user) {
    var _name = '';
    var pdCookie = Get_Cookie('pd');

    if (sectionLimitee()) {
        //_name = user.DisplayName;
        _name = getQueryString("Username", pdCookie);
        //_name = user.ExtendedProfile[0].Value;
    }
    else {
        if (user.ExtendedProfile[1] && user.ExtendedProfile[2]) {
            _name = capitaliseFirstLetter(user.ExtendedProfile[1].Value) + ' ' + capitaliseFirstLetter(user.ExtendedProfile[2].Value);
        }
        else {
            _name = user.ExtendedProfile[0].Value;
        }
    }

    userCompleteName = _name;
    return _name
}

function getJournalisteInfo(comment) {
    var info = '';
    var nom = '';
    var location = '';
    if (sectionLimitee() || ancienCommentaire(comment)) {
        info = getUserName(comment);
    }
    else {
        nom = getNomJournaliste(comment);
        info = nom;
    }
    return info;
}

// Appele les différentes fonctions qui récupèrent les informations des utilisateurs.
// Retourne un string avec le nom en lien et la ville.
function getUserInfo(comment) {
    var info = '';
    var nom = '';
    var location = '';
    if (sectionLimitee() || ancienCommentaire(comment)) {
        info = getUserName(comment);
    }
    else {
        nom = getNom(comment);
        info = nom;
    }
    return info;
}

// Retourne un flag si le commentaire est un "ancien commentaire".
// Un commentaire est ancien si il a été fait avant l'ajout du Extended profile.
function ancienCommentaire(comment) {
    ancien = false;
    var dateLimite = new Date(2011, 6, 13); //13 Juillet 2011

    if (comment.PostedAtTime) {
        var d = comment.PostedAtTime;
        d = d.replace("Date(", "");
        d = d.replace(")/", "");
        d = d.replace("/", "");

        var da = new Date();
        da.setTime(d);

        var _day = da.getDay();
        var _date = da.getDate();
        var _month = da.getMonth();
        var _year = da.getFullYear();
        var datePoster = new Date(_year, _month, _day);

        if (datePoster < dateLimite) {
            ancien = true;
        }
    }
    return ancien;
}

// Vérifie si on est dans Jeunesse.
function sectionLimitee() {
    var path = location.pathname;
    return path.startsWith('/jeunesse');
}

String.prototype.startsWith = function (str) {
    return (this.indexOf(str) === 0);
}

function getNomJournaliste(comment) {
    var name = '';

    if (comment.Owner.ExtendedProfile[1] && comment.Owner.ExtendedProfile[2]) {
        name = capitaliseFirstLetter(comment.Owner.ExtendedProfile[1].Value) + ' ' + capitaliseFirstLetter(comment.Owner.ExtendedProfile[2].Value);
        name += "</a>";
    }
    else {
        name = comment.Owner.DisplayName;
        name += "</a>";
    }
    return name;
}
// Récupère le nom complet de l'utilisateur ainsi que sa ville.
// Si l'utilisateur n'a pas de profil étendu, on récupère le displayName.
function getNom(comment) {
    var name = '';
    var firstName = '';
    var lastName = '';
    var ville = '';

    for (var i = 0; i < comment.Owner.ExtendedProfile.length; i++) {
        if (comment.Owner.ExtendedProfile[i].Key == "First Name") {
            firstName = comment.Owner.ExtendedProfile[i].Value;
        }
        if (comment.Owner.ExtendedProfile[i].Key == "Last Name") {
            lastName = comment.Owner.ExtendedProfile[i].Value;
        }
        if (comment.Owner.ExtendedProfile[i].Key == "City") {
            ville = comment.Owner.ExtendedProfile[i].Value;
        }
    }
    //if (comment.Owner.ExtendedProfile[1] && comment.Owner.ExtendedProfile[2]) {
    if (firstName != '' && lastName != '') {
        name = firstName + ' ' + lastName;
        name += "</a> de ";
        name += ville;
    }
    else {
        switch (comment.Owner.DisplayName) {
            case "157842":
                name = 'Gerry Pag&eacute;';
                name += "</a> de Qu&eacute;bec";
                break;
            case "654685":
                name = 'Fran&ccedil;ois Ledoux';
                name += "</a> de Montr&eacute;al";
                break;
            default:
                name = comment.Owner.DisplayName;
                name += "</a>";
        }
    }
    return name;
}

// Ajoute une lettre majuscule au début d'un string.
function capitaliseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Récupère le displayName de l'utilisateur
function getUserName(comment) {
    var name = comment.Owner.DisplayName + '</a>';

    if (comment.Owner.ExtendedProfile[0]) {
        name = comment.Owner.ExtendedProfile[0].Value + '</a>';
    }
    return name;
}

// Récupère la ville d'un utilisateur.
function getLocation(comment) {
    var location = '';
    if (comment.Owner.ExtendedProfile[4]) {
        location = ' de ' + comment.Owner.ExtendedProfile[4].Value; //capitaliseFirstLetter(comment.Owner.ExtendedProfile["City"]);
    }
    return location;
}

// Fonction exécutée lorsque la boucle du injectscriptfile de l'ajout d'un nouveau commentaire a retournée une valeur de l'API/pluck.
// La fonction avise l'utilisateur que son commentaire sera modéré et reset la page des commentaires + reset le formulaire.
function AddCommentCallSuccess() {

    btnClickDisabled = false;

    if (_pluckResponsestatus.indexOf("ok") > -1) {
        src_pushStats('commentaireEnvoye'); //Compile stats

        src_toCount('commentText', 'sBann', commentsMaxLength + ' caract&egrave;res restants', commentsMaxLength); //reset word counter

        more = false;

        GetPluckJSonDocumentReady(articleID, 1, commentsSorting, commentsType);

    } else {
        alert(_pluckResponsestatus);
    }

    document.getElementById('commentText').value = '';
    btnClickDisabled = false;
}

function src_renderCommentRecommendationStatus(agreedArray) {
    if (isPluckActive === false) return;

    if (agreedArray.length > 0) {
        for (var i = 0; i < agreedArray.length; i++) {
            //document.getElementById('DisapproveCountVisible:CommentArticle:' + agreedArray[i]).innerHTML = document.getElementById('DisapproveCount:CommentArticle:' + agreedArray[i]).innerHTML;
            src_displayDecisionLabelText(agreedArray[i], true);
        }
    }
}

function src_displayDecisionLabelText(CommentKey, agree) {
    if (isPluckActive === false) return;
}



function src_renderDisapprovals() {
    /*
    if (isPluckActive === false) return;

    // Si le nombre de commentaires qui ont été updatés n'égale pas le nombre de commentaire par page alors l'update n'a pas été complété et on doit faire le call pour les recommend bidons.
    if (flag < commentsPerPage) {

        var nbArticles = 0;
        var requestBatch = new RequestBatch();
        for (var j = 0; j < _pluckResponse.Items.length; j++) {
            requestBatch.AddToRequest(new ArticleKey('CommentArticle:' + _pluckResponse.Items[j].CommentKey.Key));
            nbArticles++;
        }
        if (nbArticles > 0) requestBatch.BeginRequest(src_serverUrl, src_renderDisapprovalsComplete);
    } else {
        flag = 0; // reset la variable flag pour la prochaine page.
    }
	*/
}

function src_renderDisapprovalsComplete(responseBatch) {
    if (isPluckActive === false) return;


    if (switchvalueArray.length > 0) {

        for (var i = 0; i < responseBatch.Responses.length; i++) {
            if (responseBatch.Responses[i].Article) {
                if (responseBatch.Responses[i].Article.ArticleKey && responseBatch.Responses[i].Article.ArticleKey.Key) {
                    src_renderDisapprovalDisplay(responseBatch.Responses[i].Article);
                }
            }
        }

        // Exécute l'update maintenant que tous les disapprove et positivescore sont faits.
        if (switchvalueArray.length > 0) {
            migreRecommendToScores();
        }

        flag = 0; // reset la variable flag pour la prochaine page.
    }
}

var quelElementDuArray = 0;
function migreRecommendToScores() {

    if (quelElementDuArray < switchvalueArray.length) {
        UpdateValeurRecommendations(switchvalueArray[quelElementDuArray][1], switchvalueArray[quelElementDuArray][0], switchvalueArray[quelElementDuArray][2]);
        quelElementDuArray++;
    } else {
        quelElementDuArray = 0;
        return;
    }
}

function src_submitAbuse() {
    if (isPluckActive === false) return;

    var key = document.getElementById('abuseKey').value;
    var reason = document.getElementById('abuseType').value;
    var description = document.getElementById('abuseComment').value;

    if (reason == '') {
        alert('Veuillez s&eacute;lectionner un type d\'abus.');
    } else {
        description = (description != '' && description != 'undefined' && description != null) ? encodeToHTMLEntities(description) : description;
        src_reportAbuse(key, reason, description);
    }
}
function src_reportAbuse(key, reason, description) {
    /*
    if (isPluckActive === false) return;

    var requestBatch = new RequestBatch();
    var commentKey = new CommentKey(key);
    var abuseReport = new ReportAbuseAction(commentKey, reason, description);
    requestBatch.AddToRequest(abuseReport);
    requestBatch.BeginRequest(src_serverUrl, src_renderAbuseReported);
	*/
}

function src_renderAbuseReported(responseBatch) {
    if (isPluckActive === false) return;

    if (responseBatch.Messages[0].Message == 'ok') {
        var key = document.getElementById('abuseKey').value;
        var abuseLink = document.getElementById('AbuseAction:' + key);

        //Remove link and replace it with a SPAN
        var newDiv = document.createElement('span');
        newDiv.className = 'reported';
        newDiv.innerHTML = 'Ce commentaire a &eacute;t&eacute; signal&eacute;';
        abuseLink.parentNode.insertBefore(newDiv, abuseLink);
        abuseLink.parentNode.removeChild(abuseLink);

        src_pushStats('commentaireAbus'); //Compile stats
        src_closeAbuseForm();
    }
}

function src_openAbuseForm(parent, key) {
    if (isPluckActive === false) return;

    var offsetLeft = 0;
    var offsetTop = 486; //sports et information

    document.getElementById('abuseKey').value = key; //Insert CommentKey into hidden field
    var div = document.getElementById('commentAbuse');
    div.style.display = 'block';

    var placement = src_findPos(parent);
    div.style.right = offsetLeft + 'px';
    div.style.top = placement[1] - offsetTop + 'px';
}

function src_closeAbuseForm() {
    if (isPluckActive === false) return;

    document.getElementById('abuseKey').value = '';
    document.getElementById('abuseType').value = '';
    document.getElementById('abuseComment').value = '';
    document.getElementById('commentAbuse').style.display = 'none';
}

function src_findPos(obj) {
    if (isPluckActive === false) return;

    var curleft = curtop = 0;
    if (obj.offsetParent) {
        curleft = obj.offsetLeft;
        curtop = obj.offsetTop;
        while (obj = obj.offsetParent) {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        }
    }
    return [curleft, curtop];
}

function loadMorePages() {

    _pluckResponse = "";
    _pluckReady = false;
    _pluckReadyScores = false;
    _pluckReadyAdd = false;

    switchvalueArray = new Array();

    var nextPage = (currentPage + 1);

    //alert(articleID + " " + (currentPage + 1) + " " + commentsSorting + " " + commentsType);
    GetPluckJSON(articleID, nextPage, commentsSorting, commentsType);


    if ((currentPage + 1) >= endPage) {
        document.getElementById('innerShowMorePage').innerHTML = "";
    } else {
        currentPage = (currentPage + 1);
    }

}

function src_embedNavigation(nbComments, commentsPerPage) {

    if (isPluckActive === false) return;

    if (article.Comments.NumberOfComments > 0) {
        document.getElementById("sortSelect").style.display = "inline";
    }

    var html = '';

    //var HTMLBlock = document.getElementById('commentNav'); //Div where nav will be created
    var HTMLBlock = document.getElementById('innerShowMorePage'); //Div where nav will be created

    var nbPages = Math.ceil(nbComments / commentsPerPage);

    var startPage = 1;
    endPage = nbPages;

    var commentairesDePremierNiveauxrestants = (article.Comments.NumberOfTopLevelComments - (commentsPerPage * currentPage));

    if (commentairesDePremierNiveauxrestants == 1) {
        html = '<a href="javascript:;" onclick="javascript:loadMorePages();" class="plus">Afficher la contribution suivante</a>';
    }
    else if (commentairesDePremierNiveauxrestants > 10) {
        html = '<a href="javascript:;" onclick="javascript:loadMorePages();" class="plus">Afficher les ' + Math.min(commentairesDePremierNiveauxrestants, 10) + ' contributions suivantes (' + commentairesDePremierNiveauxrestants + ')</a>';
    }
    else if (commentairesDePremierNiveauxrestants > 1) {
        html = '<a href="javascript:;" onclick="javascript:loadMorePages();" class="plus">Afficher les ' + Math.min(commentairesDePremierNiveauxrestants, 10) + ' contributions suivantes</a>';
    }

    HTMLBlock.innerHTML = html;
}

function src_splitTitle(s) {
    if (isPluckActive === false) return;

    var title = s.split('|');
    return (title.length > 0) ? title[0] : document.title;
}

function src_returnCommentTitle() {
    if (isPluckActive === false) return;

    switch (commentsType) {
        case 'article':
            return ' cet article';
            break;
        case 'nouvelles':
            return ' cette nouvelle';
            break;
        case 'chronique':
            return ' cette chronique';
            break;
        case 'discussion':
            return ' cette discussion';
            break;
        default:
            return ' cet article';
            break;
    }
}

function src_validateCommentType(t) {
    if (isPluckActive === false) return;

    var a = new String(t);
    a = t != null || t == 'undefined' ? t.toLowerCase() : '';
    switch (a) {
        case 'chroniques':
            return 'chronique';
            break;
        default:
            return 'article';
    }
}

function src_validatePageNumber(pageNumber) {
    if (isPluckActive === false) return;

    return pageNumber <= 0 || isNaN(pageNumber) ? 1 : Number(pageNumber);
}

function src_validateSorting(sort) {
    if (isPluckActive === false) return;

    return (sort == 'TimeStampAscending' || sort == 'RecommendationsDescending' || sort == 'RecommendationsAscending') ? sort : 'TimeStampDescending';
}


function src_sortComments(ddn, s) {

    // Si le tri est vide, alors ne fait rien.
    if (s != "") {
        commentsSorting = s;

        if (isPluckActive === false) return;

        more = false;

        document.getElementById('innerCommentPage').innerHTML = "";
        document.getElementById('innerShowMorePage').innerHTML = "";

        jQuery(document).ready(function () {
            GetPluckJSonDocumentReady(articleID, 1, commentsSorting, commentsType);
        });
    }
}

function src_formatDateTime(d) {
    if (isPluckActive === false) return;

    var d_names = new Array('dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi');
    var m_names = new Array('janvier', 'f&eacute;vrier', 'mars', 'avril', 'mai', 'juin', 'juillet', 'ao&ucirc;t', 'septembre', 'octobre', 'novembre', 'd&eacute;cembre');

    d = d.replace("Date(", "");
    d = d.replace(")/", "");
    d = d.replace("/", "");


    var da = new Date();
    da.setTime(d);


    var curr_day = da.getDay();
    var curr_date = da.getDate();
    var curr_month = da.getMonth();
    var curr_year = da.getFullYear();
    var sup = curr_date == 1 ? 'er' : '';

    //var dt = d_names[curr_day] + ' ' +curr_date + '<sup>' + sup + '</sup> ' + m_names[curr_month] + ' ' + curr_year;
    var dt = curr_date + '<sup>' + sup + '</sup> ' + m_names[curr_month] + ' ' + curr_year;
    var tm = src_padLeft(da.getHours()) + ' h ' + src_padLeft(da.getMinutes());
    var dst = da >= src_setDSTStart(da.getFullYear()) && da < src_setDSTEnd(da.getFullYear()) ? 'HAE' : 'HNE';

    return dt + ' &agrave; ' + tm + ' ' + dst;
}

function src_setDSTStart(y) {	//DST starts on 2nd Sunday of March
    if (isPluckActive === false) return;

    var sunday = 0;
    var n = new Date(y, 2, 1, 0, 0, 0, 0); //March 1st 20??

    for (var i = 1; i <= 31; i++) {
        n.setDate(i);
        if (n.getDay() == 0) {
            sunday++;
            if (sunday == 2) break;
        }
    }
    return (n);
}

function src_setDSTEnd(y) {	//DST ends on 1st Sunday of November
    if (isPluckActive === false) return;

    var sunday = 0;
    var n = new Date(y, 10, 1, 0, 0, 0, 0); //November 1st 20??

    for (var i = 1; i <= 30; i++) {
        n.setDate(i);
        if (n.getDay() == 0)
            break;
    }
    return (n);
}

function src_padLeft(val) {
    if (isPluckActive === false) return;

    return val < 10 ? '0' + val : val;
}

function encodeToHTMLEntities(s) {
    if (isPluckActive === false) return;

    var result = '';
    for (var i = 0; i < s.length; i++) {
        var c = s.charAt(i);
        result += {
            '&': '&amp;', 'Ÿ': '&Yuml;', '¡': '&iexcl;', '¢': '&cent;', '£': '&pound;', '¤': '&curren;', '¥': '&yen', '¦': '&brvbar;', '§': '&sect;',
            '¨': '&uml;', '©': '&copy;', 'ª': '&ordf;', '«': '&laquo;', '¬': '&not;', '­': '&shy;', '®': '&reg;', '¯': '&masr;', '°': '&deg;', '±': '&plusmn;',
            '²': '&sup2;', '³': '&sup3;', '´': '&acute;', 'µ': '&micro;', '¶': '&para;', '·': '&middot;', '¸': '&cedil;', '¹': '&sup1;', 'º': '&ordm;', '»': '&raquo;',
            '¼': '&frac14;', '½': '&frac12;', '¾': '&frac34;', '¿': '&iquest;', 'À': '&Agrave;', 'Á': '&Aacute;', 'Â': '&Acirc;', 'Ã': '&Atilde;', 'Ä': '&Auml;',
            'Å': '&Aring;', 'Æ': '&Aelig', 'Ç': '&Ccedil;', 'È': '&Egrave;', 'É': '&Eacute;', 'Ê': '&Ecirc;', 'Ë': '&Euml;', 'Ì': '&Igrave;', 'Í': '&Iacute;', 'Î': '&Icirc;',
            'Ï': '&Iuml;', 'Ð': '&eth;', 'Ñ': '&Ntilde;', 'Ò': '&Ograve;', 'Ó': '&Oacute;', 'Ô': '&Ocirc;', 'Õ': '&Otilde;', 'Ö': '&Ouml;', '×': '&times;', 'Ø': '&Oslash;',
            'Ù': '&Ugrave;', 'Ú': '&Uacute;', 'Û': '&Ucirc;', 'Ü': '&Uuml;', 'Ý': '&Yacute;', 'Þ': '&thorn;', 'ß': '&szlig;', 'à': '&agrave;', 'á': '&aacute;', 'â': '&acirc;',
            'ã': '&atilde;', 'ä': '&auml;', 'å': '&aring;', 'æ': '&aelig;', 'ç': '&ccedil;', 'è': '&egrave;', 'é': '&eacute;', 'ê': '&ecirc;', 'ë': '&euml;', 'ì': '&igrave;',
            'í': '&iacute;', 'î': '&icirc;', 'ï': '&iuml;', 'ð': '&eth;', 'ñ': '&ntilde;', 'ò': '&ograve;', 'ó': '&oacute;', 'ô': '&ocirc;', 'õ': '&otilde;', 'ö': '&ouml;',
            '÷': '&divide;', 'ø': '&oslash;', 'ù': '&ugrave;', 'ú': '&uacute;', 'û': '&ucirc;', 'ü': '&uuml;', 'ý': '&yacute;', 'þ': '&thorn;', 'ÿ': '&yuml;'
        }[c] || c;
    }
    return result;
}

function src_getObject(obj) {
    if (isPluckActive === false) return;

    var theObj;
    if (document.all) {
        if (typeof obj == "string") {
            return document.all(obj);
        } else {
            return obj.style;
        }
    }
    if (document.getElementById) {
        if (typeof obj == "string") {
            return document.getElementById(obj);
        } else {
            return obj.style;
        }
    }
    return null;
}

function src_toCount(entrance, exit, text, characters) {
    if (isPluckActive === false) return;

    var entranceObj = src_getObject(entrance);
    var exitObj = src_getObject(exit);
    var length = characters - entranceObj.value.length;
    if (length <= 0) {
        length = 0;
        text = text;
        entranceObj.value = entranceObj.value.substr(0, characters);
    }
    exitObj.innerHTML = text.replace("{CHAR}", length);
}

function src_showHideCounter(show) {
    if (isPluckActive === false) return;

    var counter = document.getElementById('sBann');
    if (counter) counter.style.visibility = show == true ? 'visible' : 'hidden';
}

function src_pushStats(contenu) {
    if (isPluckActive === false) return;

    statsToClics(
		'WT.clic', 'clics_commentaire',
		'clic_action', articleID,
		'clic_contenu', contenu
	);
}

function removeHTMLTags(inputName) {
    if (document.getElementById && document.getElementById(inputName)) {
        var strInputCode = document.getElementById(inputName).value;

        //This line is optional, it replaces escaped brackets with real ones,
        //i.e. < is replaced with < and > is replaced with >

        strInputCode = strInputCode.replace(/&(lt|gt);/g, function (strMatch, p1) {
            return (p1 == "lt") ? "<" : ">";
        });
        var strTagStrippedText = strInputCode.replace(/<\/?[^>]+(>|$)/g, "");

        document.getElementById(inputName).value = strTagStrippedText;
    }
}

function showNoCommentLegalNotice(id) {
    document.getElementById('avertissementEmbargo').style.display = "block";
}

function acceptSignedComments() {
    if (document.getElementById('acceptSignedComments') && document.getElementById('btnSubmit')) {
        var checkSignedComments = document.getElementById('acceptSignedComments');
        var btnSubmit = document.getElementById('btnSubmit');
        if (checkSignedComments.checked) {
            btnSubmit.className = "btnEnvoyer";
            btnSubmit.href = "#";
            btnSubmit.onclick = submitComment;
            Set_Cookie('acceptSignedComments', 'true');
        }
        else {
            document.getElementById('btnSubmit').className = "btnEnvoyerDisabled";
            btnSubmit.onclick = alertSignedComments;
            deleteCookie();
        }
    }
}

// Nettoie le code de balises HTML malveillants.
function submitComment() {
    removeHTMLTags('commentText');

    src_submitComment();

    return false;
}

// Alerte l'utilisateur qu'il doit accepter de révéler son nom. Exécuté si la case à cocher ne l'est pas.
function alertSignedComments() {
    alert('Vous devez accepter que votre pr\u00E9nom et nom de famille soient publi\u00E9s');
}


// Écrit la base du formulaire et les textes légaux dans les DIV destinées à Pluck dans la page. La div pluckform-id doit se trouver dans toutes les pages d'avance.
function showCommentBox(id) {
    var pdCookie = Get_Cookie('pd');

    if (isPluckActive === false) return;

    var HTMLBlock = document.getElementById('pluckForm-' + id);

    if (HTMLBlock) {
        var output = '';
        output += '<a name="commenter" id="commenter"></a>';
        output += '<div id="commentForm">';
        output += '<h2 class="title-block-gradient" id="commentDisplayText"></h2>';

        output += '<div id="loginLink">';

        if (!sectionLimitee()) {
            output += 'Vous devez &ecirc;tre connect&eacute; pour contribuer &agrave la discussion';
            output += '<ul>';
            output += '<li><a href="#" onclick=\"connect()\">Se connecter </a></li>';
            output += '<li><a href="https://mesabonnements.radio-canada.ca/Register.aspx?redirecturl=' + window.location + '#commentaires" target="_blank">Cr&eacute;er un compte</a></li>';
            output += '</ul>';
            output += '</div>';

            if (_450 == true) {
                output += '<p class="txtLegal"><span class="important">Important</span> Afin de favoriser des discussions riches, respectueuses et constructives, <strong>chaque contribution soumise sur les tribunes de <a href="http://www.radio-canada.ca">Radio-Canada.ca</a> sera dor&eacute;navant sign&eacute;e des nom(s) et pr&eacute;nom(s) de son auteur</strong> (&agrave; l\'exception de la zone Jeunesse). Le nom d\'utilisateur (pseudonyme) ne sera plus affich&eacute;.</p>';
            } else {
                output += '<p class="txtLegal"><span class="important">Important</span> Afin de favoriser des discussions riches, respectueuses et constructives, <strong>chaque commentaire soumis sur les tribunes de <a href="http://www.radio-canada.ca">Radio-Canada.ca</a> sera dor&eacute;navant sign&eacute; des nom(s) et pr&eacute;nom(s) de son auteur</strong> (&agrave; l\'exception de la zone Jeunesse). Le nom d\'utilisateur (pseudonyme) ne sera plus affich&eacute;.</p>';
            }

            if (_450 == true) {
                output += '<p class="txtLegal">En nous soumettant vos contributions, vous reconnaissez que Radio-Canada a le droit de les ';
            } else {
                output += '<p class="txtLegal">En nous soumettant vos commentaires, vous reconnaissez que Radio-Canada a le droit de les ';
            }

            output += 'reproduire et de les diffuser, en tout ou en partie et de quelque mani&egrave;re que ce soit. Veuillez ';

            if (_450 == true) {
                output += 'noter que Radio-Canada ne cautionne pas les opinions exprim&eacute;es. Vos contributions seront mod&eacute;r&eacute;es, ';
            } else {
                output += 'noter que Radio-Canada ne cautionne pas les opinions exprim&eacute;es. Vos commentaires seront mod&eacute;r&eacute;s, ';
            }

            if (_450 == true) {
                output += 'et publi&eacute;es si elles respectent la <a href="#" onclick="openPopup(\'http://www.radio-canada.ca/apropos/conditionsutilisation/netiquette/popUp.shtml\', 600,500, \'yes\'); return false;">n&eacute;tiquette</a>. Bonne discussion !</p>';
            } else {
                output += 'et publi&eacute;s s\'ils respectent la <a href="#" onclick="openPopup(\'http://www.radio-canada.ca/apropos/conditionsutilisation/netiquette/popUp.shtml\', 600,500, \'yes\'); return false;">n&eacute;tiquette</a>. Bonne discussion !</p>';
            }

            if (!sectionLimitee()) {
                output += '<div class=confirmSignedComments id=confirmSignedComments><p class=textAcceptSignedComments><input type=checkbox class=chkAcceptSignedComments =acceptSignedComments id=acceptSignedComments onclick=acceptSignedComments() ' + chkAcceptSignedComments + '>&nbsp;J\'accepte que mes nom(s) et pr&eacute;nom(s) soient publi&eacute;s</p></div>';
            }
        }
        else {
            output += 'Tu dois &ecirc;tre connect&eacute; pour contribuer &agrave la discussion';
            output += '<ul>';
            output += '<li><a href="http://inscription-jeunesse.radio-canada.ca/ouvrir-une-session" id="ssoConnect" class="ssoConnect btn_jeunesse btn_rouge">Connexion<span class="coinDroite"></span></a></li>';
            //output += '<li><a href="https://mesabonnements.radio-canada.ca/Register.aspx?redirecturl=' + window.location + '#commentaires" target="_blank">Cr&eacute;er un compte</a></li>';			
            output += '</ul>';
            output += '</div>';
            output += '<p class="txtLegal">Tes commentaires seront publi&eacute;s s\'ils respectent la <a href="http://pp-www.radio-canada.ca/jeunesse/netiquette/" class="important">n&eacute;tiquette</a>. Bonne discussion !</p>';
        }


        if (messagePublic && !sectionLimitee()) {
            output += '<br><span class="important">Radio-Canada.ca a r&eacute;cement eu des probl&egrave;mes de publication de commentaires. Des commentaires n\'ont pas &eacute;t&eacute; publi&eacute;s. Si vous rencontrez de tels probl&egrave;mes, veuillez communiquer avec notre <a href="http://auditoire.radio-canada.ca" target="_blank">service &agrave; l\'auditoire</a></span>';
        }


        if (problemeModeration) {
            output += '<br><span class="important">Un probl&egrave;me technique nous emp&ecirc;che temporairement de mod&eacute;rer et d\'afficher vos commentaires. <br> Merci de votre compr&eacute;hension.</span>';
        }

        output += '<textarea id="ReplyIDHiddenBox" style="display:none;" ></textarea>';
        output += '<textarea id="replytoNameHiddenBox" style="display:none;"></textarea>';


        //AddComment(articleID, currentUserKey, encodeURIComponent(userCompleteName.replace("</a>", "").replace("<%2Fa>", "")), encodeURIComponent(text), encodeURIComponent(title) , encodeURIComponent(document.location.href));

        var title = getDocumentTitle();
        var nickname = replaceUserName();
        var section = '';

        if (PluckLib.IsCookieJeunesse(pdCookie)) {
            section = 'jeunesse';
        }

        userCompleteName = changeIt(userCompleteName);

        output += '<form name="formPluck" id="formPluck" method="post" action="' + RCPluckSDKEndPointAddComment + '">';
        output += '<input type="hidden" name="articleId" value="' + articleID + '">';
        output += '<input type="hidden" id="command" name="command" value="addcomment">';
        output += '<input type="hidden" id="section" name="section" value="' + section + '">';
        output += '<input type="hidden" name="articleUrl" value="' + encodeURIComponent(document.location.href) + '">';
        output += '<input type="hidden" name="articleTitle" value="' + encodeURIComponent(title) + '">';
        output += '<input type="hidden" id="currentUserKey" name="userid" value="' + currentUserKey + '">';
        output += '<input type="hidden" id="responseTo" name="responseTo" value="' + currentUserKey + '">';
        output += '<input type="hidden" id="username" name="username" value="' + encodeURIComponent(userCompleteName.replace("</a>", "").replace("<%2Fa>", "")) + '">';
        output += '<input type="hidden" name="useremail" value="">';

        output += '<div id="ReplyToRemainder"></div><textarea name="t" #class="comment-block" id="commentText" disabled="disabled" onclick="src_showHideCounter(true);" onpaste="src_toCount(\'commentText\', \'sBann\', \'{CHAR} caract&egrave;res restants\', ' + commentsMaxLength + ');" onblur="src_toCount(\'commentText\', \'sBann\', \'{CHAR} caract&egrave;res restants\', ' + commentsMaxLength + '); src_showHideCounter(false);" onkeyup="src_toCount(\'commentText\', \'sBann\', \'{CHAR} caract&egrave;res restants\', ' + commentsMaxLength + ');"></textarea>';
        output += '</form>';

        output += '<span class="nbCaracteres" id="sBann">' + commentsMaxLength + ' caract&egrave;res restants</span>';
        //output += '<p class="caractere">' + commentsMaxLength + caract&egrave;res minimum</p>';

        var chkAcceptSignedComments = "";
        var btnSubmitClass = "btnEnvoyerDisabled";

        if (isAcceptSignedComments()) {
            chkAcceptSignedComments = 'checked="checked"';
        }

        output += '<div id="formBtn">';
        if (!sectionLimitee() && !isAcceptSignedComments()) {
            output += '<a id="btnSubmit" name="btnSumbit" class="btnEnvoyerDisabled" href="#btnSumbit" onclick="alertSignedComments()">Envoyer</a><br/><br/>';
        }
        else {
            output += '<a id="btnSubmit" name="btnSumbit" class="btnEnvoyer" href="#btnSumbit" onclick="javascript:submitComment();">Envoyer</a><br/><br/>';
        }
        output += '</div>';
        HTMLBlock.innerHTML = output;
    }
}

var unsafeString = "\"<>%\\^[]`\+\$\,";

var hexVals = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
              "A", "B", "C", "D", "E", "F");

function openPopup(url, width, height, scrollbars) {
    popup = window.open(url, 'name', 'height=' + height + ', width=' + width + ', scrollbars=' + scrollbars);
    if (window.focus) { popup.focus(); }
    return false;
}

function isUnsafe(compareChar)
    // this function checks to see if a char is URL unsafe.
    // Returns bool result. True = unsafe, False = safe
{
    if (unsafeString.indexOf(compareChar) == -1 && compareChar.charCodeAt(0) > 32 && compareChar.charCodeAt(0) < 123)
    { return false; } // found no unsafe chars, return false
    else
    { return true; }
}

function convert(val) // this converts a given char to url hex form
{ return "%" + decToHex(val.charCodeAt(0), 16); }


function decToHex(num, radix)
    // part of the hex-ifying functionality
{
    var hexString = "";
    while (num >= radix) {
        temp = num % radix;
        num = Math.floor(num / radix);
        hexString += hexVals[temp];
    }
    hexString += hexVals[num];
    return reversal(hexString);
}


function reversal(s) // part of the hex-ifying functionality
{
    var len = s.length;
    var trans = "";
    for (i = 0; i < len; i++)
    { trans = trans + s.substring(len - i - 1, len - i); }
    s = trans;
    return s;
}


function changeIt(val)
    // changed Mar 25, 2002: added if on 122 and else block on 129 to exclude Unicode range
{
    var len = val.length;
    var backlen = len;
    var i = 0;
    var newStr = "";
    var frag = "";
    var encval = "";
    var original = val;


    for (i = 0; i < len; i++) {
        if (val.substring(i, i + 1).charCodeAt(0) < 255) // hack to eliminate the rest of unicode from this
        {
            if (isUnsafe(val.substring(i, i + 1)) == false)
            { newStr = newStr + val.substring(i, i + 1); }
            else
            {
                //newStr = newStr + convert(val.substring(i,i+1));
            }
        }
        else // woopsie! restore.
        {
            newStr = original; i = len; // short-circuit the loop and exit
        }
    }

    return newStr;
}

function addNameIntoText(text) {
    var cookieName = 'at';
    var cookieValue = readCookie(cookieName);
    var newNickname = getNewNickname(cookieValue);
    //newNickname = UTF8.decode(newNickname);

    text = encodeURIComponent(newNickname) + ' a ecrit: ' + text;

    return text;
}

function replaceUserName() {
    try {
        var cookieName = 'at';
        var cookieValue = readCookie(cookieName);

        var currentNickname = getCurrentNickname(cookieValue);
        var newNickname = getNewNickname(cookieValue);
        newNickname = replaceNickname(cookieValue, cookieName, currentNickname, newNickname);

        return newNickname;
    }
    catch (err) {

    }
}

function replaceNickname(cookieValue, cookieName, currentNickname, newNickname) {
    newNickname = changeIt(newNickname);
    //newNickname = UTF8.encode(newNickname);
    //newNickname = encodeURIComponent(newNickname);

    var newCookieValue = cookieValue.replace('&a=' + currentNickname, '&a=' + newNickname);

    if (!(newCookieValue.indexOf("&v=11") > -1)) {
        newCookieValue = newCookieValue + '&v=11';
    }

    Set_Cookie(cookieName, newCookieValue);
    cookieValue = readCookie(cookieName);

    return newNickname;
}

function getNewNickname(cookieValue) {
    var ARRcookies = cookieValue.split("&pd=");
    var pd = ARRcookies[1];
    var pd2 = UTF8.decode(pd);

    var pd3 = decode_base64(pd2);

    var tabExtendedProfil = pd3.split("&");
    var firstNameComplete = tabExtendedProfil[1].split("=");
    var lastNameComplete = tabExtendedProfil[2].split("=");
    var cityComplete = tabExtendedProfil[4].split("=");

    var firstName = firstNameComplete[1];
    var lastName = lastNameComplete[1];
    var city = cityComplete[1];
    var nickname = firstName + ' ' + lastName + ' de ' + city;
    nickname = UTF8.decode(nickname);

    return nickname;
}

function getCurrentNickname(cookieValue) {
    var afterNickname = cookieValue.split("&a=");
    var nicknameComplete = afterNickname[1].split("&");
    return nicknameComplete[0];
}
UTF8 = {
    encode: function (s) {
        for (var c, i = -1, l = (s = s.split("")).length, o = String.fromCharCode; ++i < l;
			s[i] = (c = s[i].charCodeAt(0)) >= 127 ? o(0xc0 | (c >>> 6)) + o(0x80 | (c & 0x3f)) : s[i]
		);
        return s.join("");
    },
    decode: function (s) {
        for (var a, b, i = -1, l = (s = s.split("")).length, o = String.fromCharCode, c = "charCodeAt"; ++i < l;
			((a = s[i][c](0)) & 0x80) &&
			(s[i] = (a & 0xfc) == 0xc0 && ((b = s[i + 1][c](0)) & 0xc0) == 0x80 ?
			o(((a & 0x03) << 6) + (b & 0x3f)) : o(128), s[++i] = "")
		);
        return s.join("");
    }
};

function decode_base64(s) {
    var e = {}, i, k, v = [], r = '', w = String.fromCharCode;
    var n = [[65, 91], [97, 123], [48, 58], [47, 48], [43, 44]];

    for (z in n) { for (i = n[z][0]; i < n[z][1]; i++) { v.push(w(i)); } }
    for (i = 0; i < 64; i++) { e[v[i]] = i; }

    for (i = 0; i < s.length; i += 72) {
        var b = 0, c, x, l = 0, o = s.substring(i, i + 72);
        for (x = 0; x < o.length; x++) {
            c = e[o.charAt(x)]; b = (b << 6) + c; l += 6;
            while (l >= 8) { r += w((b >>> (l -= 8)) % 256); }
        }
    }
    return r;
}

function isAcceptSignedComments() {
    if (Get_Cookie('acceptSignedComments')) {
        return Get_Cookie('acceptSignedComments');
    }
    return false;
}

function connect() {
    deleteCookie();
    window.location = 'https://inscription.radio-canada.ca/SSOAuthenticationDomain.ashx?mode=login&redirecturl=' + window.location + '#commentaires';
}

function readCookie(c_name) {
    var i, x, y, ARRcookies = document.cookie.split(";");
    for (i = 0; i < ARRcookies.length; i++) {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g, "");
        if (x == c_name) {
            return unescape(y);
        }
    }
}

function deleteCookie(cookieName) {

    if (typeof (cookieName) === "undefined") {
        name = 'acceptSignedComments';
    }
    else {
        name = cookieName;
    }

    Set_Cookie(name, 'false');
    path = '/';
    domain = ''

    if (Get_Cookie(name)) document.cookie = name + "=" +
	((path) ? ";path=" + path : "") +
	((domain) ? ";domain=" + domain : "") +
	";expires=Thu, 01-Jan-1970 00:00:01 GMT";
}

function getCookie(c_name) {
    var i, x, y, ARRcookies = document.cookie.split(";");
    for (i = 0; i < ARRcookies.length; i++) {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g, "");
        if (x == c_name) {
            return unescape(y);
        }
    }
}

function Get_Cookie(c_name) {
    var i, x, y, ARRcookies = document.cookie.split(";");
    for (i = 0; i < ARRcookies.length; i++) {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g, "");
        if (x == c_name) {
            return unescape(y);
        }
    }
}

// Vérifie dans quel timezone on se trouve.
function getTime(zone, success) {
    var url = 'http://json-time.appspot.com/time.json?tz=' + zone,
	ud = 'json' + (+new Date());
    window[ud] = function (o) {
        success && success(new Date(o.datetime), o);
    };

    document.getElementsByTagName('head')[0].appendChild(
		(function () {
		    var s = document.createElement('script');
		    s.type = 'text/javascript';
		    s.src = url + '&callback=' + ud;
		    return s;
		}
	)());
}

// Récupère un querrystring de l'URL (pour ancre par exemple)
function getQueryString(qString, stringToParse) {
    if (typeof (stringToParse) === "undefined") {
        hu = window.location.search.substring(1);
    }
    else {
        hu = stringToParse;
    }
    gy = hu.split("&");
    for (i = 0; i < gy.length; i++) {
        ft = gy[i].split("=");
        if (ft[0] == qString) {
            return ft[1];
        }
    }
}


// Désactive les commentaires selon évènements spéciaux (élections)
function verifierEmbargo(time) {
    var data = time;
    var currentTime = (new Date(data)).getTime();

    var beginTime = (new Date(2011, 04, 27, 8, 0, 0, 0)).getTime();
    var endTime = (new Date(2011, 04, 27, 10, 30, 0, 0)).getTime();

    if (beginTime <= currentTime && endTime >= currentTime) {
        return true;
    }
    else {
        return false;
    }
}

function Set_Cookie(name, value) {
    path = '/';
    domain = 'radio-canada.ca'
    secondes = 24 * 60 * 60 * 1000; //1 journée
    var today = new Date();
    today.setTime(today.getTime());
    var expires = new Date(today.getTime() + (secondes));
    var secure = "";


    document.cookie = name + "=" + escape(value) +
	((expires) ? ";expires=" + expires.toGMTString() : "") +
	((path) ? ";path=" + path : "") +
	((domain) ? ";domain=" + domain : "") +
	((secure) ? ";secure" : "");
}

function getDocumentTitle() {
    var title = ''
    if (article != null && article.title != null) {
        title = article.title;
    }
    else {
        if (document.title != null && document.title != "") {
            title = document.title;
        }
        else {
            title = document.location.href;
        }
    }
    return title;
}

// Variables pour la configuration de base (contenu du fichier legacy pluck.js)

var sDomainExtention = (document.location.host.indexOf(".dev") != -1) ? "dev" : "ca";
sDomainExtention = (document.location.host.indexOf(".pp") != -1) ? "pp" : sDomainExtention; //PP fix
sDomainExtention = (document.location.host.indexOf(".lab") != -1) ? "lab" : sDomainExtention; //lab fix
//document.domain = 'radio-canada.' + sDomainExtention;
var sPluckUrl = (sDomainExtention == 'dev') ? 'http://sitelifestage.radio-canada.dev/ver1.0/Direct' : 'http://sitelife.radio-canada.ca/ver1.0/Direct';
var src_serverUrl = sPluckUrl + "/Process";
var isPluckActive = true; // mettre à false pour désactiver

// Doit être chargé pour faire fonctionner le Signalement d'abus
//document.write('<sc' + 'ript language="javascript" type="text/javascript" src="' + sPluckUrl + '/DirectProxy"></sc' + 'ript>'); // Données Proxy pour les méthodes Legacy uniquement.


var nbArticles = 0;
var divName = 'pl-';
var divClassInitialize = 'fillPluck';

var btnLabel = 'Commenter';

if (document.location.href.indexOf("blogues.radio-canada.ca/monteregie") > -1)
    btnLabel = 'Contribuer';

if (document.location.href.indexOf("http://blogues.radio-canada.ca/rive-sud") > -1)
    btnLabel = 'Contribuer';

if (document.location.href.indexOf("http://blogues.radio-canada.ca/rive-nord") > -1)
    btnLabel = 'Contribuer';


function src_loadSummary(_btnLabel) {
    /*
    if (isPluckActive === false) return;

    if (typeof (_btnLabel) != "undefined") btnLabel = _btnLabel;
    var requestBatch = new RequestBatch();
    var tag = new String();
    var articleKey;


    //var divToFill = document.getElements('div[class*=' + divClassInitialize + ']');
    var divToFill = document.getElementsByTagName('div[class*=' + divClassInitialize + ']');
    for (var i = 0; i < divToFill.length; i++) {
        if (divToFill[i].innerHTML == '') {
            requestBatch.AddToRequest(
				new ArticleKey(
					divToFill[i].id.substring(
						divName.length,
						divToFill[i].id.length
					)
				)
			);
            nbArticles++;
        }
    }
    if (nbArticles > 0) requestBatch.BeginRequest(src_serverUrl, src_renderArticles);
	*/
}

function src_renderArticles(responseBatch) {
    if (isPluckActive === false) return;

    if (responseBatch.Responses.length == 0) {

    } else {
        var article;
        for (i = 0; i < nbArticles; i++) {
            if (responseBatch.Responses[i]) {
                article = responseBatch.Responses[i].Article;
                src_displayArticleSummary(article.ArticleKey.Key, article.Comments.NumberOfComments, article.PageUrl);
            }
        }
    }
}

function src_displayArticleSummary(articleKey, nbComments, PageUrl) {
    if (isPluckActive === false) return;

    console.trace(articleKey);

    var _oSummaryDiv = $(divName + articleKey);
    if (_oSummaryDiv.hasClass('plNone')) {
        btnLabel = (_oSummaryDiv.innerHTML == "") ? btnLabel : _oSummaryDiv.innerHTML;
    } else {
        var _sComments = btnLabel;
        var _sNbComments = nbComments >= 1 ? '&nbsp;(' + nbComments + ')' : '';
        var _ctl = _oSummaryDiv.title;

        var _html;
        if (PageUrl.indexOf('?') == -1)
            _html = '<a href="' + PageUrl + '?ref=icoCommentaire#commentaires" onclick="CT(\'' + _ctl + '\');"><span class="libelle">' + _sComments + '</span><span>' + _sNbComments + '</span>&nbsp;&raquo;</a>';
        else
            _html = '<a href="' + PageUrl + '&ref=icoCommentaire#commentaires" onclick="CT(\'' + _ctl + '\');"><span class="libelle">' + _sComments + '</span><span>' + _sNbComments + '</span>&nbsp;&raquo;</a>';

        _oSummaryDiv.innerHTML = _html;
        _oSummaryDiv.title = '';
    }
    oSrc.oPlusX.showCommentBtn(
		{
		    'n': nbComments,
		    'uid': articleKey,
		    'label': btnLabel
		}
	);
}

function src_drawSummaryDiv(ID, first, inline, CT) {
    if (isPluckActive === false) return;

    document.write(src_renderSummaryDiv(ID, first, inline, CT));
};

function src_returnSummaryDiv(sIdDivToFill, ID, first, inline, CT) {
    if (isPluckActive === false) return;

    $(sIdDivToFill).innerHTML = src_renderSummaryDiv(ID, first, inline, CT);
};
function src_renderSummaryDiv(ID, first, inline, CT) {
    if (isPluckActive === false) return;

    var className = first == true ? 'plFull' : 'plCompact';
    if (inline) className += ' plCompactInline';
    if (CT == 'undefined' || CT == null || CT == '') CT = '';
    return ('<div id="' + divName + ID + '" class="' + divClassInitialize + ' ' + className + '" title="' + CT + '"></div>');
};

function src_drawInitializeDiv(ID, _btnLabel) {
    if (isPluckActive === false) return;

    if (typeof (_btnLabel) == "undefined") _btnLabel = '';
    document.write('<div id="' + divName + ID + '" class="' + divClassInitialize + ' plNone"></div>');
};