(function (window, document, $, $S) {
    (function (window, document, $, Scoreboards) {
        (function (window, document, $, Templates) {

            Templates.ContentEditable = React.createClass({
                render: function(){
					
					var that = this;
					var contentEditable = "true";
					var classValue = "content-editable";

					if ( typeof that.props.allowEditing !== "undefined" && that.props.allowEditing === false  )
					{
						contentEditable = "false";
						classValue += " editing-disabled";
					}

                    if(typeof that.state.allowEditing !== "undefined" && that.state.allowEditing === false)  {
                        contentEditable = "false";
                        classValue += " editing-disabled";
                    }

                    return (<div className={classValue}
                        onInput={this.emitChange} 
                        onBlur={this.emitChange}
                        contentEditable={contentEditable}
                        dangerouslySetInnerHTML={{__html: this.props.html}}></div>);

                },

                getInitialState : function() {
                    return  { 
                        allowEditing : typeof this.props.allowEditing !== "undefined" ? this.props.allowEditing : false,
						allowHtml: typeof this.props.allowHtml !== "undefined" ? this.props.allowHtml : false
                    };
                },

                componentWillReceiveProps: function(nextProps){
            
                    if (nextProps.hasOwnProperty("allowEditing")) {
                        var allowEditing = nextProps.allowEditing;
                        this.setState({
                            allowEditing : allowEditing
                        });
                    }
                },

                shouldComponentUpdate: function(nextProps){
                    if(nextProps.html === ( this.state.allowHtml ? this.getDOMNode().innerHTML : this.getDOMNode().textContent.trim() ) ) {
                        return (nextProps.allowEditing !== this.props.allowEditing);
                    } else {
                        return true;
                    }
                },
                
                componentDidUpdate: function() {
                    if ( this.props.html !== this.getDOMNode().innerHTML ) {
                       this.getDOMNode().innerHTML = this.props.html;
                    }
                },
                    
                emitChange: function(){
                    var that = this;
                    var html = ( this.state.allowHtml ? this.getDOMNode().innerHTML : this.getDOMNode().textContent.trim() );

                    if (this.props.onChange && html !== this.lastHtml) {
                        
                        if(that.props.hasOwnProperty("index")) {
                            that.props.onChange({
                                target : {
                                    value:html,
                                },
                                index: that.props.index,
                                teamType : that.props.teamType
                            });
                        } else if(that.props.hasOwnProperty("detailType")){
                            that.props.onChange({
                                target : {
                                    value : html
                                },
                                detailType : that.props.detailType,
                                teamType : that.props.teamType
                            });
                        } else if(that.props.hasOwnProperty("teamType")){
                            that.props.onChange({
                                target: {
                                    value:html
                                },
                                teamType: that.props.teamType
                            });
                        } else {
                            that.props.onChange({
                                target: {
                                    value: html
                                }
                            });
                        }
                    }
                    this.lastHtml = html;
                }
            });

        }(window, document, jQuery || jQuerySL, Scoreboards.Templates || (Scoreboards.Templates = {})));
    }(window, document, jQuery || jQuerySL, $S.Scoreboards || ($S.Scoreboards = {})));
}(window, document, jQuery || jQuerySL, SCRIBBLE || (SCRIBBLE = {})));