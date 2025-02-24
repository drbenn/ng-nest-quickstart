import {  provideStore,  Store } from '@ngxs/store';
import { TestBed } from '@angular/core/testing';
import { AuthenticationStateModel, AuthState } from './auth.state';
import { SetAuthData } from './auth.actions';

describe('[TEST]: AuthStore', () => {
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideStore([AuthState])]
    });

    store = TestBed.inject(Store);
  });

  it('Should be correct dispatch and value is empty', () => {
    // Arrange
    const Authentication: AuthenticationStateModel = {
      id: '',
      firstName: '',
      lastName: '',
      fullName: '',
      email: '',
      roles: []
    };

    // Act
    store.dispatch(new SetAuthData(Authentication));
    const actual = store.selectSnapshot<AuthenticationStateModel>(AuthState.getAuthData);

    // Assert
    expect(actual).toEqual(Authentication);
  });

  it('Should be correct dispatch and next value is correct completed', () => {
    // Arrange
    const authentication: AuthenticationStateModel = {
      id: '12',
      firstName: 'Adam',
      lastName: 'Gordon',
      fullName: 'Adam Gordon',
      email: 'agordon@google.com',
      roles: ['ADMIN']
    };

    // Act
    store.dispatch(new SetAuthData(authentication));
    const actual = store.selectSnapshot<AuthenticationStateModel>(AuthState.getAuthData);

    // Assert
    expect(actual).toEqual(authentication);
  });
});
