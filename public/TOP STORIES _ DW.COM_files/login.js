(function ($, window, undefined) {

    var $S = SCRIBBLE.namespace('liveblog'),

        defaults = {
            swfupload: {
                id: 'SCRBBL-SWFUpload',
                $el: $('.scrbbl-tb-login-avatar')
            },
            crossdomain: {
                enabled: false,
                redirect: ''
            },
            is: {
                html5: true,
                gigya: true,
                iframe: false,
                discussions: false
            }
        };


    var Login = function (opts) {

        this.opts = $.extend(true, {}, defaults, opts);

        this.inst = {
            gigya: null,
            swfupload: {
                id: this.opts.swfupload.id,
                inst: null
            },
            swfuploadDialog: {
                id: (this.opts.swfuploadDialog != null) ? this.opts.swfuploadDialog.id : null,
                inst: null
            }
        };


        if (this.opts.is.gigya) {

            this.inst.gigya = {
                conf: {
                    APIKey: '2_8nkPycJKm7ldFV5QUt1wRg0qQ7XghIJASqQ3VLM10AGUPeP5K-TGhqtkXbwU7RdA',
                    lang: SCRIBBLE.globals.lang
                },
                provider: null,
                XHR: null
            }

        }


        this.init();

    };


    Login.prototype = {

        constructor: Login,

        init: function () {

            var that = this;


            // HTML5 features that we need are not supported by this browser.. lets set up
            // an alternative method. We only need this for anonymous logins so we can ignore
            // it when in the context of the social iframe.
            if (!this.opts.is.html5 && !this.opts.is.iframe) {
                this.avatar.swfupload._init.call(this);
            }

            /* EVENT LISTENERS ============================================================ */

            // GIGYA: Setup Gigya binds.
            if (this.opts.is.gigya) {
                this.gigya.binds.call(this);
            }


            $(document).on({

                // 'SCRBBL-Login': .
                'SCRBBL-Login': function (e, data) {

                    if (data.type === 'social') {

                        that.login.social.call(that, data.provider);

                    } else if (data.type === 'anon') {

                        that.login.anonymous.call(that, data.user);

                    }

                },

                // 'SCRBBL-Logout': .
                'SCRBBL-Logout': function (e, data) {

                    that.logout.call(that);

                },

                // 'SCRBBL-IFrame-Redirect': .
                'SCRBBL-IFrame-Redirect': function (e, data) {
                    that.gigya.login.successful.call(that, data);
                }

            });

            /* ============================================================================ */

            // Add the login defaults to the user object.
            SCRIBBLE.globals.user.login = {
                aspsid: '',
                uid: '',
                required: true
            }

        },

        login: {

            anonymous: function () {

                if (!this.opts.is.html5) {
                    if (this.inst.swfupload.inst !== null && this.inst.swfupload.inst.getStats().files_queued > 0) {
                        this.inst.swfupload.inst.startUpload();
                    } else if (this.inst.swfuploadDialog.inst !== null && this.inst.swfuploadDialog.inst.getStats().files_queued > 0) {
                        this.inst.swfuploadDialog.inst.startUpload();
                    } else {
                        $(window).trigger('loggedin.gigya');
                        $(document).trigger('SCRBBL-LoginComplete', { open: true });
                    }
                } else {
                    this.avatar.html5.call(this);
                }

            },

            social: function (provider) {

                if (this.opts.is.gigya) {
                    gigya.services.socialize.login(this.inst.gigya.conf, { 'provider': provider });
                }

            }

        },

        logout: function () {

            SCRIBBLE.globals.user = {};

            if (this.opts.is.gigya) {
                this.gigya.logout.call(this);
            }

        },

        bind_dialog: function (swfuploadDialog) {
            this.inst.swfuploadDialog.id = swfuploadDialog.id;
            this.inst.swfuploadDialog.inst = swfuploadDialog;
            this.opts.swfuploadDialog = swfuploadDialog;
            this.opts.swfuploadDialog.$el.append('<div id="scrbbl-swfupload-dialog"></div>');
            this.inst.swfuploadDialog.inst = this.avatar.swfupload._init_swfupload.call(this, 'scrbbl-swfupload-dialog', swfuploadDialog);
        },

        avatar: {

            html5: function () {

                var data = new FormData();
                data.append('file', SCRIBBLE.globals.user.avatar);

                $.ajax({
                    url: SCRIBBLE.globals.website.urls.root + SCRIBBLE.globals.website.urls.path + 'api/rest/user/avatar/upload',
                    data: data,
                    processData: false,
                    contentType: false,
                    type: 'POST',
                    success: function (data, textStatus, XMLHttpRequest) {
                        SCRIBBLE.globals.user.avatar = data;
                        $(window).trigger('loggedin.gigya');
                        $(document).trigger('SCRBBL-LoginComplete', { open: true });
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        //
                    }
                });

            },

            swfupload: {

                _init: function () {

                    var that = this,
                        interval;


                    if (typeof SWFUpload !== 'undefined') {

                        this.avatar.swfupload._setup.call(this);

                    } else {

                        interval = setInterval(function () {

                            if (typeof SWFUpload !== 'undefined') {

                                that.avatar.swfupload._setup.call(that);
                                clearInterval(interval);

                            }

                        }, 200);

                        if ($('#' + this.opts.swfupload.id).length <= 0) {
                            $('body').append('<script type="text/javascript" id="' + this.opts.swfupload.id +
                                                '" src="' + SCRIBBLE.globals.website.urls.base + 'liveblog/libs/swfupload/swfupload.js"></script>');
                        }

                    }

                },

                _setup: function () {

                    var that = this;

                    this.opts.swfupload.$el.append('<div id="scrbbl-swfupload"></div>');
                    this.inst.swfupload.inst = this.avatar.swfupload._init_swfupload.call(this, 'scrbbl-swfupload', that.opts.swfupload);

                },

                _init_swfupload: function(placeholder_id, swfUploadObj){

                    return new SWFUpload({ 
                        button_placeholder_id: placeholder_id,
                        upload_url: SCRIBBLE.globals.website.urls.root + SCRIBBLE.globals.website.urls.path + 'api/rest/user/avatar/upload', 
                        flash_url: ((SCRIBBLE.globals.website.cdn.enabled) ? SCRIBBLE.globals.website.cdn.prefix : SCRIBBLE.globals.website.urls.root) + 
                                    SCRIBBLE.globals.website.urls.path + 'liveblog/libs/swfupload/swfupload.swf',

                        file_size_limit: '5 MB',
                        button_width: '100',
                        button_height: '100',
                        button_window_mode: 'transparent',
                        button_cursor: SWFUpload.CURSOR.HAND,
                        prevent_swf_caching: false,
                        file_types: '*.jpg;*.jpeg;*.gif;*.png;*.bmp',
                        file_upload_limit: 1,
                        file_queue_limit: 1,
                        file_queued_handler: function (file) {
                            swfUploadObj.handlers.queued(file);
                        },
                        file_dialog_start_handler: function () {
                            this.cancelUpload();
                            swfUploadObj.handlers.start();
                        },
                        file_queue_error_handler: function () {
                        },
                        upload_error_handler: function() {
                        },
                        upload_success_handler: function (file, server_data, receivedResponse) {
                            SCRIBBLE.globals.user.avatar = server_data;
                            swfUploadObj.handlers.success();
                        },
                        upload_complete_handler: function () {
                            $(window).trigger('loggedin.gigya');
                            $(document).trigger('SCRBBL-LoginComplete', { open: true });
                            swfUploadObj.handlers.complete();
                        }
                    });

                }

            }

        },

        gigya: {

            binds: function () {

                var that = this;
                if (typeof (gigya) !== "undefined" && typeof (gigya.services) !== "undefined") {
                    gigya.services.socialize.addEventHandlers(this.inst.gigya.conf, {
                        context: { str: 'congrats on your' },
                        onLogin: this.gigya.login.start.bind(this)
                    });
                }

            },

            login: {

                start: function (obj) {

                    var that = this;

                    try {

                        //in a proper gigya response all of these are defined, can be blank
                        this.inst.gigya.XHR = $.ajax({
                            url: SCRIBBLE.globals.website.urls.base + 'User/Gigya.aspx?ajax=1&lang=' + this.inst.gigya.conf.lang,
                            type: 'POST',
                            data: {
                                Sig: obj.signature,
                                TimeStamp: obj.timestamp,
                                UID: obj.UID,
                                ProviderType: obj.user.loginProvider,
                                ProviderUid: obj.user.identities[obj.user.loginProvider].providerUID,
                                Name: obj.user.nickname,
                                Avatar: obj.user.thumbnailURL,
                                Email: obj.user.email
                            },
                            success: function (data, textStatus, XMLHttpRequest) {

                                if (data != "0") {

                                    var type = obj.user.loginProvider || null,
                                        providerId = obj.user.identities[type].providerUID || null,
                                        first = obj.user.firstName || null,
                                        last = obj.user.lastName || null,
                                        nick = obj.user.nickname || null,
                                        avatar = obj.user.photoURL || null,
                                        email = obj.user.email || null,
                                        age = obj.user.age || null,
                                        gender = obj.user.gender || null,
                                        city = obj.user.city || null,
                                        country = obj.user.country || null;

                                    if (that.opts.crossdomain.enabled) {
                                        window.location = that.opts.crossdomain.redirect + "?ASPSESSID=" + data + "&type=" + type + "&providerId=" + providerId + "&firstname=" + first + "&lastName=" + last + "&nickName=" + nick + "&avatar=" + avatar + "&email=" + email + "&age=" + age + "&gender=" + gender + "&city=" + city + "&country=" + country + (that.opts.is.discussions ? '&discussions' : '');
                                    } else {
                                        obj.aspsid = data;
                                        obj.uid = obj.UID;
                                        that.gigya.login.successful.call(that, obj);
                                    }

                                } else {

                                    $(document).trigger('SCRBBL-LoginError');

                                }

                            },
                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                                $(document).trigger('SCRBBL-LoginError');
                            }
                        });

                    } catch (ex) {

                        //gigya's response might not be complete if something went wrong on their side
                        //this will stop the login process and let the user know
                        $(document).trigger('SCRBBL-LoginError');

                    }

                },

                successful: function (obj) {

                    var $$ = (this.opts.is.iframe) ? parent.jQuerySL : $,
                        scrbbl = (this.opts.is.iframe) ? parent.SCRIBBLE : SCRIBBLE,
                        $window = (this.opts.is.iframe) ? $$(parent) : $$(window),
                        $document = (this.opts.is.iframe) ? $$(parent.document) : $$(document);


                    this.inst.gigya.provider = obj.user.loginProvider;

                    scrbbl.globals.user = {
                        login: {
                            required: true,
                            aspsid: obj.aspsid,
                            uid: obj.uid
                        },
                        name: obj.user.nickname.replace(/\\r|\\n/g, ''),
                        avatar: obj.user.thumbnailURL || '',
                        provider: obj.user.loginProvider
                    };

                    $window.trigger('loggedin.gigya');
                    $document.trigger('SCRBBL-LoginComplete', { open: obj.open, type: scrbbl.globals.user.provider, name: scrbbl.globals.user.name, avatar: scrbbl.globals.user.avatar });

                    return;
                }

            },

            logout: function () {

                var that = this;

                if (typeof (gigya.services) !== "undefined") {
                    gigya.services.socialize.logout(this.inst.gigya.conf, {});
                }
                $(window).trigger('loggedout.gigya');

                this.inst.gigya.XHR = $.ajax({
                    url: SCRIBBLE.globals.website.urls.base + 'Logout.aspx?NoRedirect=1',
                    type: 'POST',
                    data: {},
                    success: function (data, textStatus, XMLHttpRequest) {

                        SCRIBBLE.globals.user = {
                            login: {
                                aspsid: '',
                                uid: '',
                                required: true
                            }
                        };
                        that.inst.gigya.provider = null;

                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        //
                    }
                });

            }

        }

    };

    $S.Login = Login;

} ((typeof jQuerySL !== 'undefined' ? jQuerySL : jQuery), window));
