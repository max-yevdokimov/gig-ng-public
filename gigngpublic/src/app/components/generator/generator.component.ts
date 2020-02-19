import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged, tap, switchMap, catchError, timeInterval, timeout, delay } from 'rxjs/operators';
import { Grid } from 'src/app/shared/grid';

@Component({
    selector: 'generator',
    templateUrl: './generator.component.html'
})
export class GeneratorComponent implements OnInit, OnDestroy {
    grid: number[][];
    character: Observable<any>;
    code: string;
    isInputDisabled: boolean;
    characterInput: Subject<string> = new Subject<string>();
    refreshCode: Subject<any> = new Subject<any>();
    @Input() hideGrid: boolean = false;
    @Output() generate: EventEmitter<Grid> = new EventEmitter();
    private ngUnsub = new Subject();
    private characters: string = 'abcdefghijklmnopqrstuvwxyz';

    constructor() {
        this.grid = [];
        for (let i = 0; i < 10; i++) {
            this.grid[i] = [];
        }

        this.characterInput.pipe(
            takeUntil(this.ngUnsub),
            tap(() => this.isInputDisabled = true),
            tap((char) => this.generateGrid(char)),
            delay(4000),
            tap(() => this.isInputDisabled = false),
        ).subscribe();

        this.refreshCode.pipe(
            takeUntil(this.ngUnsub),
            tap(() => this.generateGrid()),
            delay(2000),
            tap(() => this.refreshCode.next()),
        ).subscribe();
        this.refreshCode.next();
    }

    ngOnInit(): void {
        this.generateGrid();
    }

    ngOnDestroy(): void {
        this.ngUnsub.next();
        this.ngUnsub.complete();
    }

    getChar(i: number) {
        return String.fromCharCode(i);
    }

    inputChanged(character: string) {
        if (character && this.characters.indexOf(character) != -1) {
            this.characterInput.next(character);
        }
    }

    generateGrid(magicChar?: string) {
        let magicCharCounter = 0;
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                if (magicChar && magicCharCounter < 20) {
                    this.grid[i][j] = magicChar.charCodeAt(0);
                    magicCharCounter++;
                } else {
                    let r = Math.floor(Math.random() * 100);
                    let charIndex = r % this.characters.length;
                    this.grid[i][j] = this.characters.charCodeAt(charIndex);
                }
            }
        }
        //console.log(this.grid);

        this.generateCode();
        this.generate.emit(<Grid>{ code: this.code, grid: this.grid });
    }

    private generateCode() {
        const seconds = (new Date()).getSeconds().toString();
        const i = Number(seconds[0]);
        const j = Number(seconds[1] ?? 0);
        const vi = this.grid[i][j];
        const vj = this.grid[j][i];
        const viCount = this.grid
            .map(arr => arr.reduce((a, b) => {
                if (b == vi) return a + 1; else return a;
            }, 0))
            .reduce((a, b) => a + b, 0) % 10;
        const vjCount = this.grid
            .map(arr => arr.reduce((a, b) => {
                if (b == vj) return a + 1; else return a;
            }, 0))
            .reduce((a, b) => a + b, 0) % 10;
        this.code = '' + viCount + vjCount;
    }
}
