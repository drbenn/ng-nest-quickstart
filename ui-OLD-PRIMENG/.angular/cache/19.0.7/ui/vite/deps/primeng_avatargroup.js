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
  ɵɵclassMap,
  ɵɵclassProp,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵgetInheritedFactory,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵsetNgModuleScope,
  ɵɵstyleMap
} from "./chunk-RVE7HEHV.js";
import "./chunk-KOIB4TPY.js";
import "./chunk-HM5YLMWO.js";
import "./chunk-WDMUDEB6.js";

// node_modules/primeng/fesm2022/primeng-avatargroup.mjs
var classes = {
  root: "p-avatar-group p-component"
};
var AvatarGroupStyle = class _AvatarGroupStyle extends BaseStyle {
  name = "avatargroup";
  classes = classes;
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵAvatarGroupStyle_BaseFactory;
    return function AvatarGroupStyle_Factory(__ngFactoryType__) {
      return (ɵAvatarGroupStyle_BaseFactory || (ɵAvatarGroupStyle_BaseFactory = ɵɵgetInheritedFactory(_AvatarGroupStyle)))(__ngFactoryType__ || _AvatarGroupStyle);
    };
  })();
  static ɵprov = ɵɵdefineInjectable({
    token: _AvatarGroupStyle,
    factory: _AvatarGroupStyle.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AvatarGroupStyle, [{
    type: Injectable
  }], null, null);
})();
var AvatarGroupClasses;
(function(AvatarGroupClasses2) {
  AvatarGroupClasses2["root"] = "p-avatar-group";
})(AvatarGroupClasses || (AvatarGroupClasses = {}));
var _c0 = ["*"];
var AvatarGroup = class _AvatarGroup extends BaseComponent {
  /**
   * Style class of the component
   * @group Props
   */
  styleClass;
  /**
   * Inline style of the component.
   * @group Props
   */
  style;
  get hostClass() {
    return this.styleClass;
  }
  get hostStyle() {
    return this.style;
  }
  _componentStyle = inject(AvatarGroupStyle);
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵAvatarGroup_BaseFactory;
    return function AvatarGroup_Factory(__ngFactoryType__) {
      return (ɵAvatarGroup_BaseFactory || (ɵAvatarGroup_BaseFactory = ɵɵgetInheritedFactory(_AvatarGroup)))(__ngFactoryType__ || _AvatarGroup);
    };
  })();
  static ɵcmp = ɵɵdefineComponent({
    type: _AvatarGroup,
    selectors: [["p-avatarGroup"], ["p-avatar-group"], ["p-avatargroup"]],
    hostVars: 8,
    hostBindings: function AvatarGroup_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵstyleMap(ctx.hostStyle);
        ɵɵclassMap(ctx.hostClass);
        ɵɵclassProp("p-avatar-group", true)("p-component", true);
      }
    },
    inputs: {
      styleClass: "styleClass",
      style: "style"
    },
    features: [ɵɵProvidersFeature([AvatarGroupStyle]), ɵɵInheritDefinitionFeature],
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function AvatarGroup_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0);
      }
    },
    dependencies: [CommonModule, SharedModule],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AvatarGroup, [{
    type: Component,
    args: [{
      selector: "p-avatarGroup, p-avatar-group, p-avatargroup",
      standalone: true,
      imports: [CommonModule, SharedModule],
      template: ` <ng-content></ng-content> `,
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      providers: [AvatarGroupStyle],
      host: {
        "[class.p-avatar-group]": "true",
        "[class.p-component]": "true"
      }
    }]
  }], null, {
    styleClass: [{
      type: Input
    }],
    style: [{
      type: Input
    }],
    hostClass: [{
      type: HostBinding,
      args: ["class"]
    }],
    hostStyle: [{
      type: HostBinding,
      args: ["style"]
    }]
  });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && ɵsetClassDebugInfo(AvatarGroup, {
    className: "AvatarGroup",
    filePath: "avatargroup.ts",
    lineNumber: 24
  });
})();
var AvatarGroupModule = class _AvatarGroupModule {
  static ɵfac = function AvatarGroupModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AvatarGroupModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _AvatarGroupModule
  });
  static ɵinj = ɵɵdefineInjector({
    imports: [AvatarGroup, SharedModule, SharedModule]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AvatarGroupModule, [{
    type: NgModule,
    args: [{
      imports: [AvatarGroup, SharedModule],
      exports: [AvatarGroup, SharedModule]
    }]
  }], null, null);
})();
(function() {
  (typeof ngJitMode === "undefined" || ngJitMode) && ɵɵsetNgModuleScope(AvatarGroupModule, {
    imports: [AvatarGroup, SharedModule],
    exports: [AvatarGroup, SharedModule]
  });
})();
export {
  AvatarGroup,
  AvatarGroupClasses,
  AvatarGroupModule,
  AvatarGroupStyle
};
//# sourceMappingURL=primeng_avatargroup.js.map
