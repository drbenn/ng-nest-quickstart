import { ToastMessageOptions } from "primeng/api";

export class Add {
  static readonly type = 'Add';
  constructor(public amount: number) {}
}

export class DisplayToast {
  static readonly type = '[App] Display Toast';
  constructor(readonly message: ToastMessageOptions ) {}
}