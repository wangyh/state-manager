;(function(_){
    Function.prototype.method = function(name, func){
        this.prototype[name] = func;
    };

    function StateManager(context){
        this.context = context;
        this.stateMap = {};
    }

    /* register a state with on and off action. context is optional for binding "this" */
    StateManager.method('register', function(name, on, off, context){
        var c = context || this.context;
        this.stateMap[name] = {};
        this.stateMap[name]["on"] = _.bind(on, c);
        if(off){
            this.stateMap[name]["off"] = _.bind(off, c)
        }
    });

    /* shortcut for show/hide a jQuery wrapped DOM element */
    StateManager.method('registerElement', function(name, element){
        this.register(name, element["show"], element["hide"], element);
    });

    /* shortcut for show/hide a jQuery wrapped DOM elements */
    StateManager.method('registerElements', function(name, elements){
        this.register(name, function(){
            _.invoke(elements, "show");
        }, function(){
            _.invoke(elements, "hide");
        });
    });

    /* change state */
    StateManager.method('trigger', function(name){
        var obj = this.stateMap[name];
        if(!obj) return;

        _(this.stateMap)
            .chain()
            .values()
            .each(function(obj){
                if(obj["off"]){
                    obj["off"].apply(this.context);
                }
            }, this);
        if(obj["on"]){
            obj["on"].apply(this.context);
        }
    });

    this.StateManager = StateManager;
}).apply(this, _);