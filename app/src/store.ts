import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, pluck } from 'rxjs/operators';

import { User } from './auth/shared/services/auth.service';
import { Result } from './activities/shared/services/tree/tree.service';

export interface State{
    user:User
    difficulty: string
    result: Result
}

const state : State = {
    user : undefined,
    difficulty : 'easy',
    result: undefined, //last played result
}

// export interface keyState{
//     gold:string,
//     plantedTrees:string,
// }

// const keyState : keyState = {
//     gold:undefined,
//     plantedTrees:undefined,
// }

export class Store {

    private subject = new BehaviorSubject<State>(state)
    private store = this.subject.asObservable().pipe(distinctUntilChanged())
    // private subjectKeys = new BehaviorSubject<keyState>(keyState)
    // private storeKeys = this.subjectKeys.asObservable().pipe(distinctUntilChanged())
    
    get value(){
        return this.subject.value
    }

    select<T>(name:string):Observable<T>{
        return this.store.pipe(pluck(name))
        // pluck : returns an observable based on the object property
    }

    set(name:string, state:any){
        this.subject.next({
            ...this.value, [name]:state //will add the property name if id doesn't exists already
        })
    }

    // get dbKeys(){
    //     return this.subjectKeys.value
    // }
    // selectKey<T>(name:string):Observable<T>{
    //     return this.storeKeys.pipe(pluck(name))
    //     // pluck : returns an observable based on the object property
    // }

    // setKey(name:string, state:any){
    //     this.subjectKeys.next({
    //         ...this.dbKeys, [name]:state //will add the property name if id doesn't exists already
    //     })
    // }
}