/*
 * jQuery Address Plugin v${version}
 * http://www.asual.com/jquery/address/
 *
 * Copyright (c) 2009-2010 Rostislav Hristov
 * Dual licensed under the MIT and GPL licenses.
 * http://docs.jquery.com/License
 *
 * Date: ${timestamp}
 */
(function($) {
    $.address = function() {
        var _trigger = function(name) {
                $($.address).trigger($.extend($.Event(name), function() {
                    var parameters = {},
                        parameterNames = $.address.parameterNames();
                    for (var i = 0, l = parameterNames.length; i < l; i++) {
                        parameters[parameterNames[i]] = $.address.parameter(parameterNames[i]);
                    }
                    return {
                        value: $.address.value(),
                        path: $.address.path(),
                        pathNames: $.address.pathNames(),
                        parameterNames: parameterNames,
                        parameters: parameters,
                        queryString: $.address.queryString()
                    };
                }.call($.address)));
            },

            _bind = function(value, data, fn) {
                if (fn || data) {
                    $($.address).bind(value, fn || data, fn && data);
                }
                return $.address;
            },

            _getHash = function() {
                var index = _l.href.indexOf("#");
                return index != -1 ? _ec(_dc(_l.href.substr(index + 1))) : "";
            },

            _getWindow = function() {
                try {
                    return top.document != undefined ? top : window;
                } catch(e) {
                    return window;
                }
            },

            _strictCheck = function(value, force) {
                if (_opts.strict) {
                    value = force ? value.substr(0, 1) != "/" ? "/" + value : value : value == "" ? "/" : value;
                }
                return value;
            },

            _ieLocal = function(value, direction) {
                return _msie && _l.protocol == "file:" ? direction ? _value.replace(/\?/, "%3F") : _value.replace(/%253F/, "?") : value;
            },

            _searchScript = function(el) {
                for (var i = 0, l = el.childNodes.length, s; i < l; i++) {
                    if (el.childNodes[i].src) {
                        _url = String(el.childNodes[i].src);
                    }
                    if ((s = _searchScript(el.childNodes[i]))) {
                        return s;
                    }
                }
            },

            _listen = function() {
                if (!_silent) {
                    var hash = _getHash(),
                        diff = !(_value == hash);

                    if (_safari && _version < 523) {
                        if (_length != _h.length) {
                            _length = _h.length;
                            if (typeof _stack[_length - 1] != UNDEFINED) {
                                _value = _stack[_length - 1];
                            }
                            _update(false);
                        }
                    } else if (_msie && _version < 7 && diff) {
                        _l.reload();
                    } else if (diff) {
                        _value = hash;
                        _update(false);
                    }
                }
            },

            _update = function(internal) {
                _trigger("change");
                _trigger(internal ? "internalChange" : "externalChange");
                _st(_track, 10);
            },

            _track = function() {
                var value = (_l.pathname + (/\/$/.test(_l.pathname) ? "" : "/") + $.address.value()).replace(/\/\//, "/").replace(/^\/$/, ""),
                    fn = window[_opts.tracker];
                if (typeof fn == FUNCTION) {
                    fn(value);
                } else if (typeof pageTracker != UNDEFINED && typeof pageTracker._trackPageview == FUNCTION) {
                    pageTracker._trackPageview(value);
                } else if (typeof urchinTracker == FUNCTION) {
                    urchinTracker(value);
                }
            },

            _htmlWrite = function() {
                var doc = _frame.contentWindow.document;
                doc.open();
                doc.write("<html><head><title>" + _d.title + "</title><script>var " + ID + " = \"" + _getHash() + "\";<\x2fscript></head></html>");
                doc.close();
            },

            _load = function() {
                if (!_loaded) {
                    _loaded = TRUE;
                    if (_msie && _version < 8) {
                        var frameset = _d.getElementsByTagName("frameset")[0];
                        _frame = _d.createElement((frameset ? "" : "i") + "frame");
                        if (frameset) {
                            frameset.insertAdjacentElement("beforeEnd", _frame);
                            frameset[frameset.cols ? "cols" : "rows"] += ",0";
                            _frame.src = "javascript:false";
                            _frame.noResize = true;
                            _frame.frameBorder = _frame.frameSpacing = 0;
                        } else {
                            _frame.src = "javascript:false";
                            _frame.style.display = "none";
                            _d.body.insertAdjacentElement("afterBegin", _frame);
                        }
                        _st(function() {
                            $(_frame).bind("load", function() {
                                var win = _frame.contentWindow;
                                var src = win.location.href;
                                _value = typeof win[ID] != UNDEFINED ? win[ID] : "";
                                if (_value != _getHash()) {
                                    _update(false);
                                    _l.hash = _ieLocal(_value, TRUE);
                                }
                            });
                            if (typeof _frame.contentWindow[ID] == UNDEFINED) {
                                _htmlWrite();
                            }
                        },
                        50);
                    } else if (_safari) {
                        if (_version < 418) {
                            $(_d.body).append("<form id=\"" + ID + "\" style=\"position:absolute;top:-9999px;\" method=\"get\"></form>");
                            _form = _d.getElementById(ID);
                        }
                        if (typeof _l[ID] == UNDEFINED) {
                            _l[ID] = {};
                        }
                        if (typeof _l[ID][_l.pathname] != UNDEFINED) {
                            _stack = _l[ID][_l.pathname].split(",");
                        }
                    }
                    _st(function() {
                        _trigger("init");
                        _update(false);
                    },
                    1);
                    if (_msie && _version >= 8) {
                        _d.body.onhashchange = _listen;
                    } else {
                        _si(_listen, 50);
                    }
                    $("a[rel*=address:]").address();
                }
            };

        var ID = "jQueryAddress",
            FUNCTION = "function",
            UNDEFINED = "undefined",
            TRUE = true,
            FALSE = false,
            _browser = $.browser,
            _version = parseFloat($.browser.version),
            _mozilla = _browser.mozilla,
            _msie = _browser.msie,
            _opera = _browser.opera,
            _safari = _browser.safari,
            _supported = FALSE,
            _t = _getWindow(),
            _d = _t.document,
            _h = _t.history,
            _l = _t.location,
            _si = setInterval,
            _st = setTimeout,
            _dc = decodeURI,
            _ec = encodeURI,
            _agent = navigator.userAgent,
            _frame,
            _form,
            _url,
            _title = _d.title,
            _length = _h.length,
            _silent = FALSE,
            _loaded = FALSE,
            _justset = TRUE,
            _juststart = TRUE,
            _stack = [],
            _listeners = {},
            _value = _getHash(),
            _api = {},
            _opts = {
            history: TRUE,
            strict: TRUE
        };

        if (_msie) {
            _version = parseFloat(_agent.substr(_agent.indexOf("MSIE") + 4));
            if (_d.documentMode && _d.documentMode != _version) {
                _version = _d.documentMode != 8 ? 7 : 8;
            }
        }

        _supported = _mozilla && _version >= 1 || _msie && _version >= 6 || _opera && _version >= 9.5 || _safari && _version >= 312;

        if (_supported) {
            for (var i = 1; i < _length; i++) {
                _stack.push("");
            }

            _stack.push(_getHash());

            if (_msie && _l.hash != _getHash()) {
                _l.hash = "#" + _ieLocal(_getHash(), TRUE);
            }

            if (_opera) {
                history.navigationMode = "compatible";
            }
            _searchScript(document);
            var _qi = _url.indexOf("?");
            if (_url && _qi > -1) {
                var param, params = _url.substr(_qi + 1).split("&");

                for (var i = 0, p; p = params[i]; i++) {
                    param = p.split("=");

                    if (/^(history|strict)$/.test(param[0])) {
                        _opts[param[0]] = isNaN(param[1]) ? /^(true|yes)$/i.test(param[1]) : parseInt(param[1]) != 0;
                    }

                    if (/^tracker$/.test(param[0])) {
                        _opts[param[0]] = param[1];
                    }
                }
            }
            $(_load);
        } else if (!_supported && _l.href.indexOf("#") != -1 || _safari && _version < 418 && _l.href.indexOf("#") != -1 && _l.search != "") {
            _d.open();
            _d.write("<html><head><meta http-equiv=\"refresh\" content=\"0;url=" + _l.href.substr(0, _l.href.indexOf("#")) + "\" /></head></html>");
            _d.close();
        } else {
            _track();
        }

        return {
            init: function(data, fn) {
                return _bind("init", data, fn);
            },

            change: function(data, fn) {
                return _bind("change", data, fn);
            },

            internalChange: function(data, fn) {
                return _bind("internalChange", data, fn);
            },

            externalChange: function(data, fn) {
                return _bind("externalChange", data, fn);
            },

            baseURL: function() {
                var url = _l.href;
                if (url.indexOf("#") != -1) {
                    url = url.substr(0, url.indexOf("#"));
                }
                if (url.substr(url.length - 1) == "/") {
                    url = url.substr(0, url.length - 1);
                }
                return url;
            },

            strict: function(value) {
                if (value !== undefined) {
                    _opts.strict = value;
                    return this;
                }
                return _opts.strict;
            },

            history: function(value) {
                if (value !== undefined) {
                    _opts.history = value;
                    return this;
                }
                return _opts.history;
            },

            tracker: function(value) {
                if (value !== undefined) {
                    _opts.tracker = value;
                    return this;
                }
                return _opts.tracker;
            },

            title: function(value) {
                if (value !== undefined) {
                    value = _dc(value);
                    _st(function() {
                        _title = _d.title = value;
                        if (_juststart && _frame && _frame.contentWindow && _frame.contentWindow.document) {
                            _frame.contentWindow.document.title = value;
                            _juststart = FALSE;
                        }
                        if (!_justset && _mozilla) {
                            _l.replace(_l.href.indexOf("#") != -1 ? _l.href : _l.href + "#");
                        }
                        _justset = FALSE;
                    },
                    50);
                    return this;
                }
                return _d.title;
            },

            value: function(value) {
                if (value !== undefined) {
                    value = _ec(_dc(_strictCheck(value, TRUE)));
                    if (value == "/") {
                        value = "";
                    }
                    if (_value == value) {
                        return;
                    }
                    _justset = TRUE;
                    _value = value;
                    _silent = TRUE;
                    _update(true);
                    _stack[_h.length] = _value;
                    if (_safari) {
                        if (_opts.history) {
                            _l[ID][_l.pathname] = _stack.toString();
                            _length = _h.length + 1;
                            if (_version < 418) {
                                if (_l.search == "") {
                                    _form.action = "#" + _value;
                                    _form.submit();
                                }
                            } else if (_version < 523 || _value == "") {
                                var evt = _d.createEvent("MouseEvents");
                                evt.initEvent("click", TRUE, TRUE);
                                var anchor = _d.createElement("a");
                                anchor.href = "#" + _value;
                                anchor.dispatchEvent(evt);
                            } else {
                                _l.hash = "#" + _value;
                            }
                        } else {
                            _l.replace("#" + _value);
                        }
                    } else if (_value != _getHash()) {
                        if (_opts.history) {
                            _l.hash = "#" + _ieLocal(_value, TRUE);
                        } else {
                            _l.replace("#" + _value);
                        }
                    }
                    if (_msie && _version < 8 && _opts.history) {
                        _st(_htmlWrite, 50);
                    }
                    if (_safari) {
                        _st(function() {
                            _silent = FALSE;
                        },
                        1);
                    } else {
                        _silent = FALSE;
                    }
                    return this;
                }
                if (!_supported) {
                    return null;
                }
                return _dc(_strictCheck(_ieLocal(_value, FALSE), FALSE));
            },

            path: function(value) {
                if (value !== undefined) {
                    var qs = this.queryString();
                    this.value(value + (qs ? "?" + qs : ""));
                    return this;
                }
                var value = this.value();
                return value.indexOf("?") != -1 ? value.split("?")[0] : value;
            },

            queryString: function(value) {
                if (value !== undefined) {
                    this.value(this.path() + (value ? "?" + value : ""));
                    return this;
                }
                var value = this.value(),
                    index = value.indexOf("?");
                if (index != -1 && index < value.length) {
                    return value.substr(index + 1);
                }
            },

            parameter: function(name, value, append) {
                if (value !== undefined) {
                    var names = this.parameterNames(),
                        params = [];
                    for (var i = 0; i < names.length; i++) {
                        var n = names[i],
                            v = this.parameter(n);
                        if (typeof v == "string") {
                            v = [v];
                        }
                        if (n == name) {
                            v = value === null || value == "" ? [] : append ? v.concat([value]) : [value];
                        }
                        for (var j = 0; j < v.length; j++) {
                            params.push(n + ("=" + v[j]));
                        }
                    }
                    if ($.inArray(name, names) == -1) {
                        params.push(name + ("=" + value));
                    }
                    this.queryString(params.join("&"));
                    return this;
                }
                var value = this.value(),
                    index = value.indexOf("?");
                if (index != -1) {
                    value = value.substr(index + 1);
                    var params = value.split("&"),
                        r = [];
                    for (var i = 0; i < params.length; i++) {
                        var p = params[i].split("=");
                        if (p[0] == name) {
                            r.push(p[1]);
                        }
                    }
                    if (r.length != 0) {
                        return r.length != 1 ? r : r[0];
                    }
                }
            },

            pathNames: function() {
                var path = this.path(),
                    names = path.split("/");
                if (path.substr(0, 1) == "/" || path.length == 0) {
                    names.splice(0, 1);
                }
                if (path.substr(path.length - 1, 1) == "/") {
                    names.splice(names.length - 1, 1);
                }
                return names;
            },

            parameterNames: function() {
                var value = this.value(),
                    index = value.indexOf("?"),
                    names = [];
                if (index != -1) {
                    value = value.substr(index + 1);
                    if (value != "" && value.indexOf("=") != -1) {
                        var params = value.split("&");
                        for (var i = 0; i < params.length; i++) {
                            var name = params[i].split("=")[0];
                            if ($.inArray(name, names) == -1) {
                                names.push(name);
                            }
                        }
                    }
                }
                return names;
            }
        };
    }();

    $.fn.address = function(fn) {
        $(this).live("click", function() {
            var value = fn ? fn.call(this) : /address:/.test($(this).attr("data-url")) ? $(this).attr("data-url").split("address:")[1].split(" ")[0] : $(this).attr("href").replace(/^#/, "");
            $.address.value(value);
            return false;
        });
    };

}(jQuery));