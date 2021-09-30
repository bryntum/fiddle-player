const
    Project = new Siesta.Project.Browser();

Project.configure({
    title : 'Bryntum Core Test Suite',

    isReadyTimeout          : 20000, // longer for memory profiling which slows things down
    disableCaching          : false,
    autoCheckGlobals        : false,
    keepResults             : false,
    enableCodeCoverage      : Boolean(window.IstanbulCollector),
    failOnResourceLoadError : true,
    isEcmaModule            : true,
    turboMode               : true
});

Project.start([
    {
        group : 'Integration tests',
        items : [
            'comments.t.js',
            'sanity.t.js',
            'line-jumps.t.js',
            'line-waits.t.js'
        ]
    }
]);
