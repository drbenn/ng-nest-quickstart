import {
  BaseComponent
} from "./chunk-67HZBBRF.js";
import {
  BaseStyle
} from "./chunk-6NBCLZAA.js";
import "./chunk-6SEKADKZ.js";
import {
  SharedModule
} from "./chunk-OCGRZJUS.js";
import "./chunk-5DU37BC5.js";
import {
  CommonModule
} from "./chunk-YVAXARTB.js";
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Injectable,
  Input,
  NgModule,
  ViewEncapsulation,
  inject,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵInheritDefinitionFeature,
  ɵɵProvidersFeature,
  ɵɵattribute,
  ɵɵclassMap,
  ɵɵclassProp,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetInheritedFactory,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵsetNgModuleScope,
  ɵɵstyleProp
} from "./chunk-RVE7HEHV.js";
import "./chunk-KOIB4TPY.js";
import "./chunk-HM5YLMWO.js";
import "./chunk-WDMUDEB6.js";

// node_modules/primeng/fesm2022/primeng-divider.mjs
var theme = ({
  dt
}) => `
.p-divider-horizontal {
    display: flex;
    width: 100%;
    position: relative;
    align-items: center;
    margin: ${dt("divider.horizontal.margin")};
    padding: ${dt("divider.horizontal.padding")};
}

.p-divider-horizontal:before {
    position: absolute;
    display: block;
    inset-block-start: 50%;
    inset-inline-start: 0;
    width: 100%;
    content: "";
    border-block-start: 1px solid ${dt("divider.border.color")};
}

.p-divider-horizontal .p-divider-content {
    padding: ${dt("divider.horizontal.content.padding")};
}

.p-divider-vertical {
    min-height: 100%;
    display: flex;
    position: relative;
    justify-content: center;
    margin: ${dt("divider.vertical.margin")};
    padding: ${dt("divider.vertical.padding")};
}

.p-divider-vertical:before {
    position: absolute;
    display: block;
    inset-block-start: 0;
    inset-inline-start: 50%;
    height: 100%;
    content: "";
    border-inline-start: 1px solid ${dt("divider.border.color")};
}

.p-divider.p-divider-vertical .p-divider-content {
    padding: ${dt("divider.vertical.content.padding")};
}

.p-divider-content {
    z-index: 1;
    background: ${dt("divider.content.background")};
    color: ${dt("divider.content.color")};
}

.p-divider-solid.p-divider-horizontal:before {
    border-block-start-style: solid;
}

.p-divider-solid.p-divider-vertical:before {
    border-inline-start-style: solid;
}

.p-divider-dashed.p-divider-horizontal:before {
    border-block-start-style: dashed;
}

.p-divider-dashed.p-divider-vertical:before {
    border-inline-start-style: dashed;
}

.p-divider-dotted.p-divider-horizontal:before {
    border-block-start-style: dotted;
}

.p-divider-dotted.p-divider-vertical:before {
    border-inline-start-style: dotted;
}

.p-divider-left:dir(rtl),
.p-divider-right:dir(rtl) {
    flex-direction: row-reverse;
}
`;
var inlineStyles = {
  root: ({
    props
  }) => ({
    justifyContent: props.layout === "horizontal" ? props.align === "center" || props.align === null ? "center" : props.align === "left" ? "flex-start" : props.align === "right" ? "flex-end" : null : null,
    alignItems: props.layout === "vertical" ? props.align === "center" || props.align === null ? "center" : props.align === "top" ? "flex-start" : props.align === "bottom" ? "flex-end" : null : null
  })
};
var classes = {
  root: ({
    props
  }) => ["p-divider p-component", "p-divider-" + props.layout, "p-divider-" + props.type, {
    "p-divider-left": props.layout === "horizontal" && (!props.align || props.align === "left")
  }, {
    "p-divider-center": props.layout === "horizontal" && props.align === "center"
  }, {
    "p-divider-right": props.layout === "horizontal" && props.align === "right"
  }, {
    "p-divider-top": props.layout === "vertical" && props.align === "top"
  }, {
    "p-divider-center": props.layout === "vertical" && (!props.align || props.align === "center")
  }, {
    "p-divider-bottom": props.layout === "vertical" && props.align === "bottom"
  }],
  content: "p-divider-content"
};
var DividerStyle = class _DividerStyle extends BaseStyle {
  name = "divider";
  theme = theme;
  classes = classes;
  inlineStyles = inlineStyles;
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵDividerStyle_BaseFactory;
    return function DividerStyle_Factory(__ngFactoryType__) {
      return (ɵDividerStyle_BaseFactory || (ɵDividerStyle_BaseFactory = ɵɵgetInheritedFactory(_DividerStyle)))(__ngFactoryType__ || _DividerStyle);
    };
  })();
  static ɵprov = ɵɵdefineInjectable({
    token: _DividerStyle,
    factory: _DividerStyle.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DividerStyle, [{
    type: Injectable
  }], null, null);
})();
var DividerClasses;
(function(DividerClasses2) {
  DividerClasses2["root"] = "p-divider";
  DividerClasses2["content"] = "p-divider-content";
})(DividerClasses || (DividerClasses = {}));
var _c0 = ["*"];
var Divider = class _Divider extends BaseComponent {
  /**
   * Inline style of the component.
   * @group Props
   */
  style;
  /**
   * Style class of the component.
   * @group Props
   */
  styleClass;
  /**
   * Specifies the orientation.
   * @group Props
   */
  layout = "horizontal";
  /**
   * Border style type.
   * @group Props
   */
  type = "solid";
  /**
   * Alignment of the content.
   * @group Props
   */
  align;
  _componentStyle = inject(DividerStyle);
  get hostClass() {
    return this.styleClass;
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵDivider_BaseFactory;
    return function Divider_Factory(__ngFactoryType__) {
      return (ɵDivider_BaseFactory || (ɵDivider_BaseFactory = ɵɵgetInheritedFactory(_Divider)))(__ngFactoryType__ || _Divider);
    };
  })();
  static ɵcmp = ɵɵdefineComponent({
    type: _Divider,
    selectors: [["p-divider"]],
    hostVars: 33,
    hostBindings: function Divider_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵattribute("aria-orientation", ctx.layout)("data-pc-name", "divider")("role", "separator");
        ɵɵclassMap(ctx.hostClass);
        ɵɵstyleProp("justify-content", ctx.layout === "horizontal" ? ctx.align === "center" || ctx.align === void 0 ? "center" : ctx.align === "left" ? "flex-start" : ctx.align === "right" ? "flex-end" : null : null)("align-items", ctx.layout === "vertical" ? ctx.align === "center" || ctx.align === void 0 ? "center" : ctx.align === "top" ? "flex-start" : ctx.align === "bottom" ? "flex-end" : null : null);
        ɵɵclassProp("p-divider", true)("p-component", true)("p-divider-horizontal", ctx.layout === "horizontal")("p-divider-vertical", ctx.layout === "vertical")("p-divider-solid", ctx.type === "solid")("p-divider-dashed", ctx.type === "dashed")("p-divider-dotted", ctx.type === "dotted")("p-divider-left", ctx.layout === "horizontal" && (!ctx.align || ctx.align === "left"))("p-divider-center", ctx.layout === "horizontal" && ctx.align === "center" || ctx.layout === "vertical" && (!ctx.align || ctx.align === "center"))("p-divider-right", ctx.layout === "horizontal" && ctx.align === "right")("p-divider-top", ctx.layout === "vertical" && ctx.align === "top")("p-divider-bottom", ctx.layout === "vertical" && ctx.align === "bottom");
      }
    },
    inputs: {
      style: "style",
      styleClass: "styleClass",
      layout: "layout",
      type: "type",
      align: "align"
    },
    features: [ɵɵProvidersFeature([DividerStyle]), ɵɵInheritDefinitionFeature],
    ngContentSelectors: _c0,
    decls: 2,
    vars: 0,
    consts: [[1, "p-divider-content"]],
    template: function Divider_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵelementStart(0, "div", 0);
        ɵɵprojection(1);
        ɵɵelementEnd();
      }
    },
    dependencies: [CommonModule, SharedModule],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Divider, [{
    type: Component,
    args: [{
      selector: "p-divider",
      standalone: true,
      imports: [CommonModule, SharedModule],
      template: `
        <div class="p-divider-content">
            <ng-content></ng-content>
        </div>
    `,
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      host: {
        "[class.p-divider]": "true",
        "[class.p-component]": "true",
        "[class.p-divider-horizontal]": 'layout === "horizontal"',
        "[class.p-divider-vertical]": 'layout === "vertical"',
        "[class.p-divider-solid]": 'type === "solid"',
        "[class.p-divider-dashed]": 'type === "dashed"',
        "[class.p-divider-dotted]": 'type === "dotted"',
        "[class.p-divider-left]": 'layout === "horizontal" && (!align || align === "left")',
        "[class.p-divider-center]": '(layout === "horizontal" && align === "center") || (layout === "vertical" && (!align || align === "center"))',
        "[class.p-divider-right]": 'layout === "horizontal" && align === "right"',
        "[class.p-divider-top]": 'layout === "vertical" && align === "top"',
        "[class.p-divider-bottom]": 'layout === "vertical" && align === "bottom"',
        "[attr.aria-orientation]": "layout",
        "[attr.data-pc-name]": "'divider'",
        "[attr.role]": '"separator"',
        "[style.justifyContent]": 'layout === "horizontal" ? (align === "center" || align === undefined ? "center" : (align === "left" ? "flex-start" : (align === "right" ? "flex-end" : null))) : null',
        "[style.alignItems]": 'layout === "vertical" ? (align === "center" || align === undefined ? "center" : (align === "top" ? "flex-start" : (align === "bottom" ? "flex-end" : null))) : null'
      },
      providers: [DividerStyle]
    }]
  }], null, {
    style: [{
      type: Input
    }],
    styleClass: [{
      type: Input
    }],
    layout: [{
      type: Input
    }],
    type: [{
      type: Input
    }],
    align: [{
      type: Input
    }],
    hostClass: [{
      type: HostBinding,
      args: ["class"]
    }]
  });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && ɵsetClassDebugInfo(Divider, {
    className: "Divider",
    filePath: "divider.ts",
    lineNumber: 43
  });
})();
var DividerModule = class _DividerModule {
  static ɵfac = function DividerModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DividerModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _DividerModule
  });
  static ɵinj = ɵɵdefineInjector({
    imports: [Divider]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DividerModule, [{
    type: NgModule,
    args: [{
      imports: [Divider],
      exports: [Divider]
    }]
  }], null, null);
})();
(function() {
  (typeof ngJitMode === "undefined" || ngJitMode) && ɵɵsetNgModuleScope(DividerModule, {
    imports: [Divider],
    exports: [Divider]
  });
})();
export {
  Divider,
  DividerClasses,
  DividerModule,
  DividerStyle
};
//# sourceMappingURL=primeng_divider.js.map
