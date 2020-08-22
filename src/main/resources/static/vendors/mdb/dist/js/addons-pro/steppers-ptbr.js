(function (t) {
    "function" == typeof define && define.amd ? define(["jquery"], t) : "object" == typeof module && module.exports ? (module.exports = t(require("jquery"))) : t(jQuery);
})(function (t) {
    t.extend(t.fn, {
        validate: function (e) {
            if (!this.length) return void (e && e.debug && window.console && console.warn("Nothing selected, can't validate, returning nothing."));
            var i = t.data(this[0], "validator");
            return i
                ? i
                : (this.attr("novalidate", "novalidate"),
                  (i = new t.validator(e, this[0])),
                  t.data(this[0], "validator", i),
                  i.settings.onsubmit &&
                      (this.on("click.validate", ":submit", function (e) {
                          (i.submitButton = e.currentTarget), t(this).hasClass("cancel") && (i.cancelSubmit = !0), void 0 !== t(this).attr("formnovalidate") && (i.cancelSubmit = !0);
                      }),
                      this.on("submit.validate", function (e) {
                          function s() {
                              var s, n;
                              return (
                                  i.submitButton && (i.settings.submitHandler || i.formSubmitted) && (s = t("<input type='hidden'/>").attr("name", i.submitButton.name).val(t(i.submitButton).val()).appendTo(i.currentForm)),
                                  !i.settings.submitHandler || ((n = i.settings.submitHandler.call(i, i.currentForm, e)), s && s.remove(), void 0 !== n && n)
                              );
                          }
                          return i.settings.debug && e.preventDefault(), i.cancelSubmit ? ((i.cancelSubmit = !1), s()) : i.form() ? (i.pendingRequest ? ((i.formSubmitted = !0), !1) : s()) : (i.focusInvalid(), !1);
                      })),
                  i);
        },
        valid: function () {
            var e, i, s;
            return (
                t(this[0]).is("form")
                    ? (e = this.validate().form())
                    : ((s = []),
                      (e = !0),
                      (i = t(this[0].form).validate()),
                      this.each(function () {
                          (e = i.element(this) && e), e || (s = s.concat(i.errorList));
                      }),
                      (i.errorList = s)),
                e
            );
        },
        rules: function (e, i) {
            var s,
                n,
                a,
                r,
                o,
                l,
                d = this[0];
            if (null != d && (!d.form && d.hasAttribute("contenteditable") && ((d.form = this.closest("form")[0]), (d.name = this.attr("name"))), null != d.form)) {
                if (e)
                    switch (((s = t.data(d.form, "validator").settings), (n = s.rules), (a = t.validator.staticRules(d)), e)) {
                        case "add":
                            t.extend(a, t.validator.normalizeRule(i)), delete a.messages, (n[d.name] = a), i.messages && (s.messages[d.name] = t.extend(s.messages[d.name], i.messages));
                            break;
                        case "remove":
                            return i
                                ? ((l = {}),
                                  t.each(i.split(/\s/), function (t, e) {
                                      (l[e] = a[e]), delete a[e];
                                  }),
                                  l)
                                : (delete n[d.name], a);
                    }
                return (
                    (r = t.validator.normalizeRules(t.extend({}, t.validator.classRules(d), t.validator.attributeRules(d), t.validator.dataRules(d), t.validator.staticRules(d)), d)),
                    r.required && ((o = r.required), delete r.required, (r = t.extend({ required: o }, r))),
                    r.remote && ((o = r.remote), delete r.remote, (r = t.extend(r, { remote: o }))),
                    r
                );
            }
        },
    }),
        t.extend(t.expr.pseudos || t.expr[":"], {
            blank: function (e) {
                return !t.trim("" + t(e).val());
            },
            filled: function (e) {
                var i = t(e).val();
                return null !== i && !!t.trim("" + i);
            },
            unchecked: function (e) {
                return !t(e).prop("checked");
            },
        }),
        (t.validator = function (e, i) {
            (this.settings = t.extend(!0, {}, t.validator.defaults, e)), (this.currentForm = i), this.init();
        }),
        (t.validator.format = function (e, i) {
            return 1 === arguments.length
                ? function () {
                      var i = t.makeArray(arguments);
                      return i.unshift(e), t.validator.format.apply(this, i);
                  }
                : void 0 === i
                ? e
                : (arguments.length > 2 && i.constructor !== Array && (i = t.makeArray(arguments).slice(1)),
                  i.constructor !== Array && (i = [i]),
                  t.each(i, function (t, i) {
                      e = e.replace(new RegExp("\\{" + t + "\\}", "g"), function () {
                          return i;
                      });
                  }),
                  e);
        }),
        t.extend(t.validator, {
            defaults: {
                messages: {},
                groups: {},
                rules: {},
                errorClass: "error",
                pendingClass: "pending",
                validClass: "valid",
                errorElement: "label",
                focusCleanup: !1,
                focusInvalid: !0,
                errorContainer: t([]),
                errorLabelContainer: t([]),
                onsubmit: !0,
                ignore: ":hidden",
                ignoreTitle: !1,
                onfocusin: function (t) {
                    (this.lastActive = t), this.settings.focusCleanup && (this.settings.unhighlight && this.settings.unhighlight.call(this, t, this.settings.errorClass, this.settings.validClass), this.hideThese(this.errorsFor(t)));
                },
                onfocusout: function (t) {
                    this.checkable(t) || (!(t.name in this.submitted) && this.optional(t)) || this.element(t);
                },
                onkeyup: function (e, i) {
                    var s = [16, 17, 18, 20, 35, 36, 37, 38, 39, 40, 45, 144, 225];
                    (9 === i.which && "" === this.elementValue(e)) || t.inArray(i.keyCode, s) !== -1 || ((e.name in this.submitted || e.name in this.invalid) && this.element(e));
                },
                onclick: function (t) {
                    t.name in this.submitted ? this.element(t) : t.parentNode.name in this.submitted && this.element(t.parentNode);
                },
                highlight: function (e, i, s) {
                    "radio" === e.type ? this.findByName(e.name).addClass(i).removeClass(s) : t(e).addClass(i).removeClass(s);
                },
                unhighlight: function (e, i, s) {
                    "radio" === e.type ? this.findByName(e.name).removeClass(i).addClass(s) : t(e).removeClass(i).addClass(s);
                },
            },
            setDefaults: function (e) {
                t.extend(t.validator.defaults, e);
            },
            messages: {
                required: "Este campo é obrigatório.",
                remote: "Corrija este campo.",
                email: "Por favor insira um endereço de e-mail válido.",
                url: "Por favor, insira um URL válido.",
                date: "Por favor insira uma data válida.",
                dateISO: "Digite uma data válida (ISO).",
                number: "Por favor insira um número válido.",
                digits: "Digite apenas dígitos.",
                equalTo: "Por favor entre com o mesmo valor novamente.",
                maxlength: t.validator.format("Por favor, não insira mais que {0} caracteres."),
                minlength: t.validator.format("Digite pelo menos {0} caracteres."),
                rangelength: t.validator.format("Digite um valor entre {0} e {1} caracteres."),
                range: t.validator.format("Digite um valor entre {0} e {1}."),
                max: t.validator.format("Digite um valor menor ou igual a {0}."),
                min: t.validator.format("Digite um valor maior ou igual a {0}."),
                step: t.validator.format("Digite um múltiplo de {0}."),
            },
            autoCreateRanges: !1,
            prototype: {
                init: function () {
                    function e(e) {
                        !this.form && this.hasAttribute("contenteditable") && ((this.form = t(this).closest("form")[0]), (this.name = t(this).attr("name")));
                        var i = t.data(this.form, "validator"),
                            s = "on" + e.type.replace(/^validate/, ""),
                            n = i.settings;
                        n[s] && !t(this).is(n.ignore) && n[s].call(i, this, e);
                    }
                    (this.labelContainer = t(this.settings.errorLabelContainer)),
                        (this.errorContext = (this.labelContainer.length && this.labelContainer) || t(this.currentForm)),
                        (this.containers = t(this.settings.errorContainer).add(this.settings.errorLabelContainer)),
                        (this.submitted = {}),
                        (this.valueCache = {}),
                        (this.pendingRequest = 0),
                        (this.pending = {}),
                        (this.invalid = {}),
                        this.reset();
                    var i,
                        s = (this.groups = {});
                    t.each(this.settings.groups, function (e, i) {
                        "string" == typeof i && (i = i.split(/\s/)),
                            t.each(i, function (t, i) {
                                s[i] = e;
                            });
                    }),
                        (i = this.settings.rules),
                        t.each(i, function (e, s) {
                            i[e] = t.validator.normalizeRule(s);
                        }),
                        t(this.currentForm)
                            .on(
                                "focusin.validate focusout.validate keyup.validate",
                                ":text, [type='password'], [type='file'], select, textarea, [type='number'], [type='search'], [type='tel'], [type='url'], [type='email'], [type='datetime'], [type='date'], [type='month'], [type='week'], [type='time'], [type='datetime-local'], [type='range'], [type='color'], [type='radio'], [type='checkbox'], [contenteditable], [type='button']",
                                e
                            )
                            .on("click.validate", "select, option, [type='radio'], [type='checkbox']", e),
                        this.settings.invalidHandler && t(this.currentForm).on("invalid-form.validate", this.settings.invalidHandler);
                },
                form: function () {
                    return this.checkForm(), t.extend(this.submitted, this.errorMap), (this.invalid = t.extend({}, this.errorMap)), this.valid() || t(this.currentForm).triggerHandler("invalid-form", [this]), this.showErrors(), this.valid();
                },
                checkForm: function () {
                    this.prepareForm();
                    for (var t = 0, e = (this.currentElements = this.elements()); e[t]; t++) this.check(e[t]);
                    return this.valid();
                },
                element: function (e) {
                    var i,
                        s,
                        n = this.clean(e),
                        a = this.validationTargetFor(n),
                        r = this,
                        o = !0;
                    return (
                        void 0 === a
                            ? delete this.invalid[n.name]
                            : (this.prepareElement(a),
                              (this.currentElements = t(a)),
                              (s = this.groups[a.name]),
                              s &&
                                  t.each(this.groups, function (t, e) {
                                      e === s && t !== a.name && ((n = r.validationTargetFor(r.clean(r.findByName(t)))), n && n.name in r.invalid && (r.currentElements.push(n), (o = r.check(n) && o)));
                                  }),
                              (i = this.check(a) !== !1),
                              (o = o && i),
                              i ? (this.invalid[a.name] = !1) : (this.invalid[a.name] = !0),
                              this.numberOfInvalids() || (this.toHide = this.toHide.add(this.containers)),
                              this.showErrors(),
                              t(e).attr("aria-invalid", !i)),
                        o
                    );
                },
                showErrors: function (e) {
                    if (e) {
                        var i = this;
                        t.extend(this.errorMap, e),
                            (this.errorList = t.map(this.errorMap, function (t, e) {
                                return { message: t, element: i.findByName(e)[0] };
                            })),
                            (this.successList = t.grep(this.successList, function (t) {
                                return !(t.name in e);
                            }));
                    }
                    this.settings.showErrors ? this.settings.showErrors.call(this, this.errorMap, this.errorList) : this.defaultShowErrors();
                },
                resetForm: function () {
                    t.fn.resetForm && t(this.currentForm).resetForm(), (this.invalid = {}), (this.submitted = {}), this.prepareForm(), this.hideErrors();
                    var e = this.elements().removeData("previousValue").removeAttr("aria-invalid");
                    this.resetElements(e);
                },
                resetElements: function (t) {
                    var e;
                    if (this.settings.unhighlight) for (e = 0; t[e]; e++) this.settings.unhighlight.call(this, t[e], this.settings.errorClass, ""), this.findByName(t[e].name).removeClass(this.settings.validClass);
                    else t.removeClass(this.settings.errorClass).removeClass(this.settings.validClass);
                },
                numberOfInvalids: function () {
                    return this.objectLength(this.invalid);
                },
                objectLength: function (t) {
                    var e,
                        i = 0;
                    for (e in t) void 0 !== t[e] && null !== t[e] && t[e] !== !1 && i++;
                    return i;
                },
                hideErrors: function () {
                    this.hideThese(this.toHide);
                },
                hideThese: function (t) {
                    t.not(this.containers).text(""), this.addWrapper(t).hide();
                },
                valid: function () {
                    return 0 === this.size();
                },
                size: function () {
                    return this.errorList.length;
                },
                focusInvalid: function () {
                    if (this.settings.focusInvalid)
                        try {
                            t(this.findLastActive() || (this.errorList.length && this.errorList[0].element) || [])
                                .filter(":visible")
                                .focus()
                                .trigger("focusin");
                        } catch (t) {}
                },
                findLastActive: function () {
                    var e = this.lastActive;
                    return (
                        e &&
                        1 ===
                            t.grep(this.errorList, function (t) {
                                return t.element.name === e.name;
                            }).length &&
                        e
                    );
                },
                elements: function () {
                    var e = this,
                        i = {};
                    return t(this.currentForm)
                        .find("input, select, textarea, [contenteditable]")
                        .not(":submit, :reset, :image, :disabled")
                        .not(this.settings.ignore)
                        .filter(function () {
                            var s = this.name || t(this).attr("name");
                            return (
                                !s && e.settings.debug && window.console && console.error("%o has no name assigned", this),
                                this.hasAttribute("contenteditable") && ((this.form = t(this).closest("form")[0]), (this.name = s)),
                                !(s in i || !e.objectLength(t(this).rules())) && ((i[s] = !0), !0)
                            );
                        });
                },
                clean: function (e) {
                    return t(e)[0];
                },
                errors: function () {
                    var e = this.settings.errorClass.split(" ").join(".");
                    return t(this.settings.errorElement + "." + e, this.errorContext);
                },
                resetInternals: function () {
                    (this.successList = []), (this.errorList = []), (this.errorMap = {}), (this.toShow = t([])), (this.toHide = t([]));
                },
                reset: function () {
                    this.resetInternals(), (this.currentElements = t([]));
                },
                prepareForm: function () {
                    this.reset(), (this.toHide = this.errors().add(this.containers));
                },
                prepareElement: function (t) {
                    this.reset(), (this.toHide = this.errorsFor(t));
                },
                elementValue: function (e) {
                    var i,
                        s,
                        n = t(e),
                        a = e.type;
                    return "radio" === a || "checkbox" === a
                        ? this.findByName(e.name).filter(":checked").val()
                        : "number" === a && "undefined" != typeof e.validity
                        ? e.validity.badInput
                            ? "NaN"
                            : n.val()
                        : ((i = e.hasAttribute("contenteditable") ? n.text() : n.val()),
                          "file" === a
                              ? "C:\\fakepath\\" === i.substr(0, 12)
                                  ? i.substr(12)
                                  : ((s = i.lastIndexOf("/")), s >= 0 ? i.substr(s + 1) : ((s = i.lastIndexOf("\\")), s >= 0 ? i.substr(s + 1) : i))
                              : "string" == typeof i
                              ? i.replace(/\r/g, "")
                              : i);
                },
                check: function (e) {
                    e = this.validationTargetFor(this.clean(e));
                    var i,
                        s,
                        n,
                        a,
                        r = t(e).rules(),
                        o = t.map(r, function (t, e) {
                            return e;
                        }).length,
                        l = !1,
                        d = this.elementValue(e);
                    if (("function" == typeof r.normalizer ? (a = r.normalizer) : "function" == typeof this.settings.normalizer && (a = this.settings.normalizer), a)) {
                        if (((d = a.call(e, d)), "string" != typeof d)) throw new TypeError("The normalizer should return a string value.");
                        delete r.normalizer;
                    }
                    for (s in r) {
                        n = { method: s, parameters: r[s] };
                        try {
                            if (((i = t.validator.methods[s].call(this, d, e, n.parameters)), "dependency-mismatch" === i && 1 === o)) {
                                l = !0;
                                continue;
                            }
                            if (((l = !1), "pending" === i)) return void (this.toHide = this.toHide.not(this.errorsFor(e)));
                            if (!i) return this.formatAndAdd(e, n), !1;
                        } catch (t) {
                            throw (
                                (this.settings.debug && window.console && console.log("Exception occurred when checking element " + e.id + ", check the '" + n.method + "' method.", t),
                                t instanceof TypeError && (t.message += ".  Exception occurred when checking element " + e.id + ", check the '" + n.method + "' method."),
                                t)
                            );
                        }
                    }
                    if (!l) return this.objectLength(r) && this.successList.push(e), !0;
                },
                customDataMessage: function (e, i) {
                    return t(e).data("msg" + i.charAt(0).toUpperCase() + i.substring(1).toLowerCase()) || t(e).data("msg");
                },
                customMessage: function (t, e) {
                    var i = this.settings.messages[t];
                    return i && (i.constructor === String ? i : i[e]);
                },
                findDefined: function () {
                    for (var t = 0; t < arguments.length; t++) if (void 0 !== arguments[t]) return arguments[t];
                },
                defaultMessage: function (e, i) {
                    "string" == typeof i && (i = { method: i });
                    var s = this.findDefined(
                            this.customMessage(e.name, i.method),
                            this.customDataMessage(e, i.method),
                            (!this.settings.ignoreTitle && e.title) || void 0,
                            t.validator.messages[i.method],
                            "<strong>Warning: No message defined for " + e.name + "</strong>"
                        ),
                        n = /\$?\{(\d+)\}/g;
                    return "function" == typeof s ? (s = s.call(this, i.parameters, e)) : n.test(s) && (s = t.validator.format(s.replace(n, "{$1}"), i.parameters)), s;
                },
                formatAndAdd: function (t, e) {
                    var i = this.defaultMessage(t, e);
                    this.errorList.push({ message: i, element: t, method: e.method }), (this.errorMap[t.name] = i), (this.submitted[t.name] = i);
                },
                addWrapper: function (t) {
                    return this.settings.wrapper && (t = t.add(t.parent(this.settings.wrapper))), t;
                },
                defaultShowErrors: function () {
                    var t, e, i;
                    for (t = 0; this.errorList[t]; t++)
                        (i = this.errorList[t]), this.settings.highlight && this.settings.highlight.call(this, i.element, this.settings.errorClass, this.settings.validClass), this.showLabel(i.element, i.message);
                    if ((this.errorList.length && (this.toShow = this.toShow.add(this.containers)), this.settings.success)) for (t = 0; this.successList[t]; t++) this.showLabel(this.successList[t]);
                    if (this.settings.unhighlight) for (t = 0, e = this.validElements(); e[t]; t++) this.settings.unhighlight.call(this, e[t], this.settings.errorClass, this.settings.validClass);
                    (this.toHide = this.toHide.not(this.toShow)), this.hideErrors(), this.addWrapper(this.toShow).show();
                },
                validElements: function () {
                    return this.currentElements.not(this.invalidElements());
                },
                invalidElements: function () {
                    return t(this.errorList).map(function () {
                        return this.element;
                    });
                },
                showLabel: function (e, i) {
                    var s,
                        n,
                        a,
                        r,
                        o = this.errorsFor(e),
                        l = this.idOrName(e),
                        d = t(e).attr("aria-describedby");
                    o.length
                        ? (o.removeClass(this.settings.validClass).addClass(this.settings.errorClass), o.html(i))
                        : ((o = t("<" + this.settings.errorElement + ">")
                              .attr("id", l + "-error")
                              .addClass(this.settings.errorClass)
                              .html(i || "")),
                          (s = o),
                          this.settings.wrapper &&
                              (s = o
                                  .hide()
                                  .show()
                                  .wrap("<" + this.settings.wrapper + "/>")
                                  .parent()),
                          this.labelContainer.length ? this.labelContainer.append(s) : this.settings.errorPlacement ? this.settings.errorPlacement.call(this, s, t(e)) : s.insertAfter(e),
                          o.is("label")
                              ? o.attr("for", l)
                              : 0 === o.parents("label[for='" + this.escapeCssMeta(l) + "']").length &&
                                ((a = o.attr("id")),
                                d ? d.match(new RegExp("\\b" + this.escapeCssMeta(a) + "\\b")) || (d += " " + a) : (d = a),
                                t(e).attr("aria-describedby", d),
                                (n = this.groups[e.name]),
                                n &&
                                    ((r = this),
                                    t.each(r.groups, function (e, i) {
                                        i === n && t("[name='" + r.escapeCssMeta(e) + "']", r.currentForm).attr("aria-describedby", o.attr("id"));
                                    })))),
                        !i && this.settings.success && (o.text(""), "string" == typeof this.settings.success ? o.addClass(this.settings.success) : this.settings.success(o, e)),
                        (this.toShow = this.toShow.add(o));
                },
                errorsFor: function (e) {
                    var i = this.escapeCssMeta(this.idOrName(e)),
                        s = t(e).attr("aria-describedby"),
                        n = "label[for='" + i + "'], label[for='" + i + "'] *";
                    return s && (n = n + ", #" + this.escapeCssMeta(s).replace(/\s+/g, ", #")), this.errors().filter(n);
                },
                escapeCssMeta: function (t) {
                    return t.replace(/([\\!"#$%&'()*+,.\/:;<=>?@\[\]^`{|}~])/g, "\\$1");
                },
                idOrName: function (t) {
                    return this.groups[t.name] || (this.checkable(t) ? t.name : t.id || t.name);
                },
                validationTargetFor: function (e) {
                    return this.checkable(e) && (e = this.findByName(e.name)), t(e).not(this.settings.ignore)[0];
                },
                checkable: function (t) {
                    return /radio|checkbox/i.test(t.type);
                },
                findByName: function (e) {
                    return t(this.currentForm).find("[name='" + this.escapeCssMeta(e) + "']");
                },
                getLength: function (e, i) {
                    switch (i.nodeName.toLowerCase()) {
                        case "select":
                            return t("option:selected", i).length;
                        case "input":
                            if (this.checkable(i)) return this.findByName(i.name).filter(":checked").length;
                    }
                    return e.length;
                },
                depend: function (t, e) {
                    return !this.dependTypes[typeof t] || this.dependTypes[typeof t](t, e);
                },
                dependTypes: {
                    boolean: function (t) {
                        return t;
                    },
                    string: function (e, i) {
                        return !!t(e, i.form).length;
                    },
                    function: function (t, e) {
                        return t(e);
                    },
                },
                optional: function (e) {
                    var i = this.elementValue(e);
                    return !t.validator.methods.required.call(this, i, e) && "dependency-mismatch";
                },
                startRequest: function (e) {
                    this.pending[e.name] || (this.pendingRequest++, t(e).addClass(this.settings.pendingClass), (this.pending[e.name] = !0));
                },
                stopRequest: function (e, i) {
                    this.pendingRequest--,
                        this.pendingRequest < 0 && (this.pendingRequest = 0),
                        delete this.pending[e.name],
                        t(e).removeClass(this.settings.pendingClass),
                        i && 0 === this.pendingRequest && this.formSubmitted && this.form()
                            ? (t(this.currentForm).submit(), this.submitButton && t("input:hidden[name='" + this.submitButton.name + "']", this.currentForm).remove(), (this.formSubmitted = !1))
                            : !i && 0 === this.pendingRequest && this.formSubmitted && (t(this.currentForm).triggerHandler("invalid-form", [this]), (this.formSubmitted = !1));
                },
                previousValue: function (e, i) {
                    return (i = ("string" == typeof i && i) || "remote"), t.data(e, "previousValue") || t.data(e, "previousValue", { old: null, valid: !0, message: this.defaultMessage(e, { method: i }) });
                },
                destroy: function () {
                    this.resetForm(), t(this.currentForm).off(".validate").removeData("validator").find(".validate-equalTo-blur").off(".validate-equalTo").removeClass("validate-equalTo-blur");
                },
            },
            classRuleSettings: { required: { required: !0 }, email: { email: !0 }, url: { url: !0 }, date: { date: !0 }, dateISO: { dateISO: !0 }, number: { number: !0 }, digits: { digits: !0 }, creditcard: { creditcard: !0 } },
            addClassRules: function (e, i) {
                e.constructor === String ? (this.classRuleSettings[e] = i) : t.extend(this.classRuleSettings, e);
            },
            classRules: function (e) {
                var i = {},
                    s = t(e).attr("class");
                return (
                    s &&
                        t.each(s.split(" "), function () {
                            this in t.validator.classRuleSettings && t.extend(i, t.validator.classRuleSettings[this]);
                        }),
                    i
                );
            },
            normalizeAttributeRule: function (t, e, i, s) {
                /min|max|step/.test(i) && (null === e || /number|range|text/.test(e)) && ((s = Number(s)), isNaN(s) && (s = void 0)), s || 0 === s ? (t[i] = s) : e === i && "range" !== e && (t[i] = !0);
            },
            attributeRules: function (e) {
                var i,
                    s,
                    n = {},
                    a = t(e),
                    r = e.getAttribute("type");
                for (i in t.validator.methods) "required" === i ? ((s = e.getAttribute(i)), "" === s && (s = !0), (s = !!s)) : (s = a.attr(i)), this.normalizeAttributeRule(n, r, i, s);
                return n.maxlength && /-1|2147483647|524288/.test(n.maxlength) && delete n.maxlength, n;
            },
            dataRules: function (e) {
                var i,
                    s,
                    n = {},
                    a = t(e),
                    r = e.getAttribute("type");
                for (i in t.validator.methods) (s = a.data("rule" + i.charAt(0).toUpperCase() + i.substring(1).toLowerCase())), this.normalizeAttributeRule(n, r, i, s);
                return n;
            },
            staticRules: function (e) {
                var i = {},
                    s = t.data(e.form, "validator");
                return s.settings.rules && (i = t.validator.normalizeRule(s.settings.rules[e.name]) || {}), i;
            },
            normalizeRules: function (e, i) {
                return (
                    t.each(e, function (s, n) {
                        if (n === !1) return void delete e[s];
                        if (n.param || n.depends) {
                            var a = !0;
                            switch (typeof n.depends) {
                                case "string":
                                    a = !!t(n.depends, i.form).length;
                                    break;
                                case "function":
                                    a = n.depends.call(i, i);
                            }
                            a ? (e[s] = void 0 === n.param || n.param) : (t.data(i.form, "validator").resetElements(t(i)), delete e[s]);
                        }
                    }),
                    t.each(e, function (s, n) {
                        e[s] = t.isFunction(n) && "normalizer" !== s ? n(i) : n;
                    }),
                    t.each(["minlength", "maxlength"], function () {
                        e[this] && (e[this] = Number(e[this]));
                    }),
                    t.each(["rangelength", "range"], function () {
                        var i;
                        e[this] && (t.isArray(e[this]) ? (e[this] = [Number(e[this][0]), Number(e[this][1])]) : "string" == typeof e[this] && ((i = e[this].replace(/[\[\]]/g, "").split(/[\s,]+/)), (e[this] = [Number(i[0]), Number(i[1])])));
                    }),
                    t.validator.autoCreateRanges &&
                        (null != e.min && null != e.max && ((e.range = [e.min, e.max]), delete e.min, delete e.max),
                        null != e.minlength && null != e.maxlength && ((e.rangelength = [e.minlength, e.maxlength]), delete e.minlength, delete e.maxlength)),
                    e
                );
            },
            normalizeRule: function (e) {
                if ("string" == typeof e) {
                    var i = {};
                    t.each(e.split(/\s/), function () {
                        i[this] = !0;
                    }),
                        (e = i);
                }
                return e;
            },
            addMethod: function (e, i, s) {
                (t.validator.methods[e] = i), (t.validator.messages[e] = void 0 !== s ? s : t.validator.messages[e]), i.length < 3 && t.validator.addClassRules(e, t.validator.normalizeRule(e));
            },
            methods: {
                required: function (e, i, s) {
                    if (!this.depend(s, i)) return "dependency-mismatch";
                    if ("select" === i.nodeName.toLowerCase()) {
                        var n = t(i).val();
                        return n && n.length > 0;
                    }
                    return this.checkable(i) ? this.getLength(e, i) > 0 : e.length > 0;
                },
                email: function (t, e) {
                    return this.optional(e) || /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(t);
                },
                url: function (t, e) {
                    return (
                        this.optional(e) ||
                        /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[\/?#]\S*)?$/i.test(
                            t
                        )
                    );
                },
                date: function (t, e) {
                    return this.optional(e) || !/Invalid|NaN/.test(new Date(t).toString());
                },
                dateISO: function (t, e) {
                    return this.optional(e) || /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(t);
                },
                number: function (t, e) {
                    return this.optional(e) || /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(t);
                },
                digits: function (t, e) {
                    return this.optional(e) || /^\d+$/.test(t);
                },
                minlength: function (e, i, s) {
                    var n = t.isArray(e) ? e.length : this.getLength(e, i);
                    return this.optional(i) || n >= s;
                },
                maxlength: function (e, i, s) {
                    var n = t.isArray(e) ? e.length : this.getLength(e, i);
                    return this.optional(i) || n <= s;
                },
                rangelength: function (e, i, s) {
                    var n = t.isArray(e) ? e.length : this.getLength(e, i);
                    return this.optional(i) || (n >= s[0] && n <= s[1]);
                },
                min: function (t, e, i) {
                    return this.optional(e) || t >= i;
                },
                max: function (t, e, i) {
                    return this.optional(e) || t <= i;
                },
                range: function (t, e, i) {
                    return this.optional(e) || (t >= i[0] && t <= i[1]);
                },
                step: function (e, i, s) {
                    var n,
                        a = t(i).attr("type"),
                        r = "Step attribute on input type " + a + " is not supported.",
                        o = ["text", "number", "range"],
                        l = new RegExp("\\b" + a + "\\b"),
                        d = a && !l.test(o.join()),
                        h = function (t) {
                            var e = ("" + t).match(/(?:\.(\d+))?$/);
                            return e && e[1] ? e[1].length : 0;
                        },
                        c = function (t) {
                            return Math.round(t * Math.pow(10, n));
                        },
                        u = !0;
                    if (d) throw new Error(r);
                    return (n = h(s)), (h(e) > n || c(e) % c(s) !== 0) && (u = !1), this.optional(i) || u;
                },
                equalTo: function (e, i, s) {
                    var n = t(s);
                    return (
                        this.settings.onfocusout &&
                            n.not(".validate-equalTo-blur").length &&
                            n.addClass("validate-equalTo-blur").on("blur.validate-equalTo", function () {
                                t(i).valid();
                            }),
                        e === n.val()
                    );
                },
                remote: function (e, i, s, n) {
                    if (this.optional(i)) return "dependency-mismatch";
                    n = ("string" == typeof n && n) || "remote";
                    var a,
                        r,
                        o,
                        l = this.previousValue(i, n);
                    return (
                        this.settings.messages[i.name] || (this.settings.messages[i.name] = {}),
                        (l.originalMessage = l.originalMessage || this.settings.messages[i.name][n]),
                        (this.settings.messages[i.name][n] = l.message),
                        (s = ("string" == typeof s && { url: s }) || s),
                        (o = t.param(t.extend({ data: e }, s.data))),
                        l.old === o
                            ? l.valid
                            : ((l.old = o),
                              (a = this),
                              this.startRequest(i),
                              (r = {}),
                              (r[i.name] = e),
                              t.ajax(
                                  t.extend(
                                      !0,
                                      {
                                          mode: "abort",
                                          port: "validate" + i.name,
                                          dataType: "json",
                                          data: r,
                                          context: a.currentForm,
                                          success: function (t) {
                                              var s,
                                                  r,
                                                  o,
                                                  d = t === !0 || "true" === t;
                                              (a.settings.messages[i.name][n] = l.originalMessage),
                                                  d
                                                      ? ((o = a.formSubmitted), a.resetInternals(), (a.toHide = a.errorsFor(i)), (a.formSubmitted = o), a.successList.push(i), (a.invalid[i.name] = !1), a.showErrors())
                                                      : ((s = {}), (r = t || a.defaultMessage(i, { method: n, parameters: e })), (s[i.name] = l.message = r), (a.invalid[i.name] = !0), a.showErrors(s)),
                                                  (l.valid = d),
                                                  a.stopRequest(i, d);
                                          },
                                      },
                                      s
                                  )
                              ),
                              "pending")
                    );
                },
            },
        });
    var e,
        i = {};
    return (
        t.ajaxPrefilter
            ? t.ajaxPrefilter(function (t, e, s) {
                  var n = t.port;
                  "abort" === t.mode && (i[n] && i[n].abort(), (i[n] = s));
              })
            : ((e = t.ajax),
              (t.ajax = function (s) {
                  var n = ("mode" in s ? s : t.ajaxSettings).mode,
                      a = ("port" in s ? s : t.ajaxSettings).port;
                  return "abort" === n ? (i[a] && i[a].abort(), (i[a] = e.apply(this, arguments)), i[a]) : e.apply(this, arguments);
              })),
        t
    );
});
var validation = $.isFunction($.fn.valid) ? 1 : 0;
($.fn.isValid = function () {
    return !validation || this.valid();
}),
    validation &&
        ($.validator.setDefaults({
            errorClass: "invalid",
            validClass: "valid",
            errorPlacement: function (t, e) {
                e.is(":radio") || e.is(":checkbox") ? t.insertBefore($(e).parent()) : t.insertAfter(e);
            },
            success: function (t) {
                $(t).closest("li").find("label.invalid:not(:empty)").length || $(t).closest("li").removeClass("wrong");
            },
        }),
        $(".stepper.parallel").length && $.validator.setDefaults({ ignore: "" })),
    ($.fn.getActiveStep = function () {
        var t = this.find(".step.active");
        return $(this.children(".step:visible")).index($(t)) + 1;
    }),
    ($.fn.activateStep = function (t) {
        if (!$(this).hasClass("step")) {
            var e = $(this).closest("ul.stepper");
            e.find(">li").removeAttr("data-last"),
                window.innerWidth < 993 || !e.hasClass("horizontal")
                    ? $(this)
                          .addClass("step")
                          .stop()
                          .slideDown(400, function () {
                              $(this).css({ height: "auto", "margin-bottom": "", display: "inherit" }), t && t(), e.find(">li.step").last().attr("data-last", "true");
                          })
                    : $(this)
                          .addClass("step")
                          .stop()
                          .css({ width: "0%", display: "inherit" })
                          .animate({ width: "100%" }, 400, function () {
                              $(this).css({ height: "auto", "margin-bottom": "", display: "inherit" }), t && t(), e.find(">li.step").last().attr("data-last", "true");
                          });
        }
    }),
    ($.fn.deactivateStep = function (t) {
        if ($(this).hasClass("step")) {
            var e = $(this).closest("ul.stepper");
            e.find(">li").removeAttr("data-last"),
                window.innerWidth < 993 || !e.hasClass("horizontal")
                    ? $(this)
                          .stop()
                          .css({ transition: "none", "-webkit-transition": "margin-bottom none" })
                          .slideUp(400, function () {
                              $(this).removeClass("step").css({ height: "auto", "margin-bottom": "", transition: "margin-bottom .4s", "-webkit-transition": "margin-bottom .4s" }),
                                  t && t(),
                                  e.find(">li").removeAttr("data-last"),
                                  e.find(">li.step").last().attr("data-last", "true");
                          })
                    : $(this)
                          .stop()
                          .animate({ width: "0%" }, 400, function () {
                              $(this).removeClass("step").hide().css({ height: "auto", "margin-bottom": "", display: "none", width: "" }), t && t(), e.find(">li.step").last().attr("data-last", "true");
                          });
        }
    }),
    ($.fn.showError = function (t) {
        if (validation) {
            var e = this.attr("name"),
                i = this.closest("form"),
                s = {};
            (s[e] = t), i.validate().showErrors(s), this.closest("li").addClass("wrong");
        } else this.removeClass("valid").addClass("invalid"), this.next().attr("data-error", t);
    }),
    ($.fn.activateFeedback = function () {
        var t = this.find(".step.active:not(.feedbacking)").addClass("feedbacking").find(".step-new-content");
        t.prepend(
            '<div class="wait-feedback"> <div class="preloader-wrapper active"> <div class="spinner-layer spinner-blue"> <div class="circle-clipper left"> <div class="circle"></div></div><div class="gap-patch"> <div class="circle"></div></div><div class="circle-clipper right"> <div class="circle"></div></div></div><div class="spinner-layer spinner-red"> <div class="circle-clipper left"> <div class="circle"></div></div><div class="gap-patch"> <div class="circle"></div></div><div class="circle-clipper right"> <div class="circle"></div></div></div><div class="spinner-layer spinner-yellow"> <div class="circle-clipper left"> <div class="circle"></div></div><div class="gap-patch"> <div class="circle"></div></div><div class="circle-clipper right"> <div class="circle"></div></div></div><div class="spinner-layer spinner-green"> <div class="circle-clipper left"> <div class="circle"></div></div><div class="gap-patch"> <div class="circle"></div></div><div class="circle-clipper right"> <div class="circle"></div></div></div></div></div>'
        );
    }),
    ($.fn.destroyFeedback = function () {
        var t = this.find(".step.active.feedbacking");
        return t && (t.removeClass("feedbacking"), t.find(".wait-feedback").remove()), !0;
    }),
    ($.fn.resetStepper = function (t) {
        t || (t = 1);
        var e = $(this).closest("form");
        return $(e)[0].reset(), Materialize.updateTextFields(), validation && (e.validate().resetForm(), $(this).find("li.step").removeClass("wrong")), $(this).openStep(t);
    }),
    ($.fn.submitStepper = function (t) {
        var e = this.closest("form");
        e.isValid() && e.submit();
    }),
    ($.fn.nextStep = function (t, e, i) {
        var s = this,
            n = $(s).data("settings"),
            a = this.closest("form"),
            r = this.find(".step.active"),
            o = $(this.children(".step:visible")).index($(r)) + 2,
            l = r.find(".next-step").length > 1 ? (i ? $(i.target).data("feedback") : void 0) : r.find(".next-step").data("feedback");
        return (n.parallel && $(r).validateStep()) || (!n.parallel && a.isValid())
            ? l && e
                ? (n.showFeedbackLoader && s.activateFeedback(), window[l].call())
                : (r.removeClass("wrong").addClass("done"), this.openStep(o, t), this.trigger("nextstep"))
            : r.removeClass("done").addClass("wrong");
    }),
    ($.fn.prevStep = function (t) {
        var e = this.find(".step.active");
        if (!e.hasClass("feedbacking")) {
            var i = $(this.children(".step:visible")).index($(e));
            return e.removeClass("wrong"), this.openStep(i, t), this.trigger("prevstep");
        }
    }),
    ($.fn.openStep = function (t, e) {
        var i = $(this).closest("ul.stepper").data("settings"),
            s = this,
            n = t - 1;
        if (((t = this.find(".step:visible:eq(" + n + ")")), !t.hasClass("active"))) {
            var a,
                r = this.find(".step.active"),
                o = (a = $(this.children(".step:visible")).index($(r))),
                l = n > o ? 1 : 0;
            r.hasClass("feedbacking") && s.destroyFeedback(),
                r.closeAction(l),
                t.openAction(l, function () {
                    i.autoFocusInput && t.find("input:enabled:visible:first").focus(), s.trigger("stepchange").trigger("step" + (n + 1)), t.data("event") && s.trigger(t.data("event")), e && e();
                });
        }
    }),
    ($.fn.closeAction = function (t, e) {
        var i = this.removeClass("active").find(".step-new-content");
        if (
            (window.innerWidth < 993 || !this.closest("ul").hasClass("horizontal")
                ? i.stop().slideUp(300, "easeOutQuad", e)
                : 1 == t
                ? i.animate({ left: "-100%" }, function () {
                      i.css({ display: "none", left: "0%" }, e);
                  })
                : i.animate({ left: "100%" }, function () {
                      i.css({ display: "none", left: "0%" }, e);
                  }),
            this.closest("ul").hasClass("horizontal") && this.closest("ul").hasClass("horizontal-fix"))
        ) {
            var s = $(".step-new-content").children().height() + 250;
            $(this).parent().animate({ height: s }, "slow");
        }
    }),
    ($.fn.openAction = function (t, e) {
        var i = this.removeClass("done").addClass("active").find(".step-new-content");
        if (
            (window.innerWidth < 993 || !this.closest("ul").hasClass("horizontal")
                ? i.slideDown(300, "easeOutQuad", e)
                : 1 == t
                ? i.css({ left: "100%", display: "block" }).animate({ left: "0%" }, e)
                : i.css({ left: "-100%", display: "block" }).animate({ left: "0%" }, e),
            this.closest("ul").hasClass("horizontal") && this.closest("ul").hasClass("horizontal-fix"))
        ) {
            var s = $(this).find(".step-new-content").children().height() + 250;
            $(this).parent().animate({ height: s }, "fast");
        }
    }),
    ($.fn.mdbStepper = function (t) {
        var e = $.extend({ linearStepsNavigation: !0, autoFocusInput: !0, showFeedbackLoader: !0, autoFormCreation: !0, parallel: !1 }, t);
        $(document).on("click", function (t) {
            $(t.target).parents(".stepper").length || $(".stepper.focused").removeClass("focused");
        }),
            $(this).each(function () {
                var t = $(this);
                if (!t.parents("form").length && e.autoFormCreation) {
                    var i = t.data("method"),
                        s = t.data("action"),
                        i = i ? i : "GET";
                    (s = s ? s : "?"), t.wrap('<form action="' + s + '" method="' + i + '"></form>');
                }
                t.data("settings", { linearStepsNavigation: e.linearStepsNavigation, autoFocusInput: e.autoFocusInput, showFeedbackLoader: e.showFeedbackLoader, parallel: t.hasClass("parallel") }),
                    t.find("li.step.active").openAction(1),
                    t.find(">li").removeAttr("data-last"),
                    t.find(">li.step").last().attr("data-last", "true"),
                    t
                        .on("click", ".step:not(.active)", function () {
                            var i = $(t.children(".step:visible")).index($(this));
                            if (t.data("settings").parallel && validation) $(this).addClass("temp-active"), t.validatePreviousSteps(), t.openStep(i + 1), $(this).removeClass("temp-active");
                            else if (t.hasClass("linear")) {
                                if (e.linearStepsNavigation) {
                                    var s = t.find(".step.active");
                                    $(t.children(".step:visible")).index($(s)) + 1 == i ? t.nextStep(void 0, !0, void 0) : $(t.children(".step:visible")).index($(s)) - 1 == i && t.prevStep(void 0);
                                }
                            } else t.openStep(i + 1);
                        })
                        .on("click", ".next-step", function (e) {
                            e.preventDefault(), t.nextStep(void 0, !0, e);
                        })
                        .on("click", ".previous-step", function (e) {
                            e.preventDefault(), t.prevStep(void 0);
                        })
                        .on("click", "button:submit:not(.next-step, .previous-step)", function (e) {
                            e.preventDefault(), (feedback = e ? $(e.target).data("feedback") : void 0);
                            var i = t.closest("form");
                            if (i.isValid()) {
                                if (feedback) return stepper.activateFeedback(), window[feedback].call();
                                i.submit();
                            }
                        })
                        .on("click", function () {
                            $(".stepper.focused").removeClass("focused"), $(this).addClass("focused");
                        });
            });
    }),
    ($.fn.getStep = function (t) {
        var e = ($(this).closest("ul.stepper").data("settings"), t - 1);
        return (t = this.find(".step:visible:eq(" + e + ")"));
    }),
    ($.fn.validatePreviousSteps = function () {
        var t = $(this).find(".step.temp-active"),
            e = $(this.children(".step")).index($(t));
        $(this.children(".step")).each(function (t) {
            t >= e ? $(this).removeClass("wrong done") : $(this).validateStep();
        });
    }),
    ($.fn.validateStep = function () {
        var t = (this.closest("ul.stepper"), this.closest("form"), $(this)),
            e = t.find(".next-step").data("validator");
        return this.validateStepInput()
            ? e
                ? window[e].call()
                    ? (t.removeClass("wrong").addClass("done"), !0)
                    : (t.removeClass("done").addClass("wrong"), !1)
                : (t.removeClass("wrong").addClass("done"), !0)
            : (t.removeClass("done").addClass("wrong"), !1);
    }),
    ($.fn.validateStepInput = function () {
        var t = !0;
        return (
            validation &&
                $(this)
                    .find("input.validate")
                    .each(function () {
                        if (!$(this).valid()) return (t = !1), !1;
                    }),
            t
        );
    });