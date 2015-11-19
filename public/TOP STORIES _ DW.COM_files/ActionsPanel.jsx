(function (window, document, $, $S) {
    (function (window, document, $, Scoreboards) {

        Scoreboards.ActionsPanel = React.createClass({
            
            render : function(){
                return (
                    <div className="actions">
                        <button className="Button save">Save</button>
                        <button className="Button reset">Reset</button>
                    </div>
                );
            }
        
        });
    
    }(window, document, jQuery || jQuerySL, $S.Scoreboards || ($S.Scoreboards = {})));
}(window, document, jQuery || jQuerySL, SCRIBBLE || (SCRIBBLE = {})));