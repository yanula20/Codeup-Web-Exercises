(function (window, document, $, $S, undefined) {

    'use strict';

    var Scoreboards = $S.Scoreboards || {};

    Scoreboards.CompactDisplay = React.createClass({
        getInitialState : function(){
            return {
                sport: "football",
                teams: {
                    home: {
                        fullName: 'Home Team Name',
                        firstName: 'Home',
                        nickname: 'Home',
                        shortName: 'Home',
                        score: '0',
                        scoreDetail: [
                            {seg:1,score:0},
                            {seg:2,score:0}
                        ]
                    },
                    away: {
                        fullName: 'Away Team Name',
                        firstName: 'Away',
                        nickname: 'Away',
                        shortName: 'Away',
                        score: '0',
                        scoreDetail: [
                            {seg:1,score:0},
                            {seg:2,score:0}
                        ]
                    }
                },
                time: "0:0",
                currentSegment: "1st Half"
            };
        },

        componentDidMount :function(){
            if(this.props.hasOwnProperty("data")) {
                this.setState(this.props.data);
            }
        },

        componentWillReceiveProps : function(props){
            if(props.hasOwnProperty("data")) {
                this.setState(props.data);
            }
        },

        render : function(){
            var that = this;
            var logos = {
                away: null,
                home: null
            };

            if (this.state.teams.away.logo){
              logos.away = <div className="display-table-cell logo"><img src={this.state.teams.away.logo} className="away-logo logo"/></div>;
            }

            if (this.state.teams.home.logo){
                logos.home = <div className="display-table-cell logo"><img src={this.state.teams.home.logo} className="home-logo logo"/></div>;
            }

            return (
                <div className="compact-display">
                    <div className="compact-display-container display-table">
                        <div className="display-table-row scores">
                            {logos.away}
                            <div className="display-table-cell">
                                <div className="away-name">{that.state.teams.away.shortName}</div>
                            </div>
                            <div className="display-table-cell">
                                <div className="away-score">{that.state.teams.away.score}</div>
                            </div>
                            <div className="display-table-cell">
                                <span>:</span>
                            </div>
                            <div className="display-table-cell">
                                <div className="home-score">{that.state.teams.home.score}</div>
                            </div>
                            <div className="display-table-cell">
                                <div className="home-name">{that.state.teams.home.shortName}</div>
                            </div>
                            {logos.home}
                        </div>
                    </div>
                    <div className={this.props.collapsed ? "toggle collapsed" : "toggle"} onClick={this.props.handleToggleCollapse}></div>
                </div>
            );
        }
    });



}(window, document, jQuery || jQuerySL, SCRIBBLE));