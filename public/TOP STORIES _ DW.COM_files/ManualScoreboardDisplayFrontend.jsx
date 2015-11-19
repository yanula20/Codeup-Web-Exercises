(function (window, document, $, $S, undefined) {

    'use strict';

    var Scoreboards = $S.Scoreboards || {};
    var $L = Scoreboards.Lang;
    Scoreboards.ManualScoreboardDisplayFrontend = React.createClass({

        getInitialState: function () {
            return {
                isEnabled: typeof this.props.isEnabled !== "undefined" ? this.props.isEnabled : false,
                collapsed: typeof this.props.collapsed !== "undefined" ? this.props.collapsed : false,
                autoUpdate: typeof this.props.autoUpdate !== "undefined" ? this.props.autoUpdate : true,
				parentNode: typeof this.props.parentNode !== "undefined" ? $(this.props.parentNode) : undefined,
                allowEditing: false,
                showEditingControls: false,
                sport: "football",
                data: {
                    sport: null, // this must match enum from ManualScoreboard.jsx.  probably best to make global enum
                    teams: {
                        home: {
                            fullName: $L["Home_Team_Name"],
                            firstName: $L["Home"],
                            nickname: $L["Home"],
                            shortName: $L["Home"],
                            score: '0',
                            scoreDetail: [
                                {seg: 1, score: 0},
                                {seg: 2, score: 0},
                                {seg: 3, score: 0}
                            ],
                            logo: null
                        },
                        away: {
                            fullName: $L["Away_Team_Name"],
                            firstName: $L["Away"],
                            nickname: $L["Away"],
                            shortName: $L["Away"],
                            score: '0',
                            scoreDetail: [
                                {seg: 1, score: 0},
                                {seg: 2, score: 0},
                                {seg: 3, score: 0}
                            ],
                            logo: null
                        }
                    },
                    time: "00:00",
                    currentSegment: $L["First_Period"],
                    notes: $L["No_Notes_Yet"]
                },
                isLoading: typeof this.props.isEnabled !== "undefined" ? this.props.isEnabled : false,
                showOvertime: (this.props.showOvertime || false)
            }
        },

        componentDidMount: function () {
            var that = this;

            document.addEventListener('SCRBBL-ManualScoreboardUpdated', that.onUpdate, false);

            document.addEventListener('SCRBBL-ManualScoreboardDeleted', that.onDelete, false);


            if (that.state.isEnabled === true) {

                that.onUpdate();
            }
        },


        onUpdate: function () {
            var promise;
            var self = this;
            var currentState = this.state;

            if (!this.state.autoUpdate) return;

            promise = SCRIBBLE.Scoreboards.Service.get();
            promise.then(function (data) {

                // set the new state;
                currentState["data"] = data;
                currentState["isEnabled"] = true;
                currentState["allowEditing"] = false;
                currentState["isLoading"] = false;
                currentState["showOvertime"] = self.checkOverTime(data);
                self.setState(currentState);
            });
        },


        onDelete: function () {
            var that = this;
            if (that.state.autoUpdate === true) {
                this.setState({
                    isEnabled: false
                });
            }
        },

        toggleCollapse: function () {
            this.setState({
                collapsed: !this.state.collapsed
            });
        },

        updateScore: function (team, score) {
            var curState = this.state;
            curState["data"]["teams"][team]["score"] = score;
            this.setState(curState);
        },

        updateTeamShortName: function (team, name) {
            var curState = this.state;
            curState["data"]["teams"][team]["shortName"] = name;
            this.setState(curState);
        },

        checkOverTime : function(data) {
            
            var sport = Scoreboards.Service.getSportByKey(data.sport);

            for(var i = 0; i < data.teams.home.scoreDetail.length;i++) {

                if(i >= sport.segments) {
                    if( data.teams.away.scoreDetail[i].score !== "-" && !isNaN(data.teams.away.scoreDetail[i].score) ) {
                        return true;
                    }
                    
                    if( data.teams.home.scoreDetail[i].score !== "-" && !isNaN(data.teams.home.scoreDetail[i].score) ) {
                        return true;
                    }                    
                }

            }

            return false;

        },

        render: function () {
            var template;
            var sport = SCRIBBLE.Scoreboards.Service.getSportByKey(this.state.data.sport);
            var loading = <Scoreboards.LoadingOverlay visible={this.state.isLoading}/>;
			var isSmall = false;
            var compactDisplay = <Scoreboards.CompactDisplay collapsed={this.state.collapsed}
                                                             handleToggleCollapse={this.toggleCollapse} ref="toggle"
                                                             data={this.state.data}/>

			if ( window.outerWidth <= 480 )
			{
				isSmall = true;
			}

            var isFrontEnd = true;

			var showOvertime = this.state.showOvertime;

            if (!this.state.isEnabled) {
                compactDisplay = undefined;
            }

			var scoreboardClass = "manual-scoreboard-display front-end" + ( this.state.isEnabled ? '' : ' disabled' ) + ( isSmall ? " small" : "" );

            template = <SCRIBBLE.Scoreboards.Templates.Base sport={sport}
                ref="template"
                showEditingControls={this.state.showEditingControls}
                isEnabled={this.state.isEnabled}
                collapsed={this.state.collapsed}
                autoUpdate={this.state.autoUpdate}
                allowEditing={this.state.allowEditing}
                updateScore={this.updateScore}
                updateShortName={this.updateTeamShortName}
				showOvertime={showOvertime}
				parentNode={this.state.parentNode}
                data={this.state.data}
                isFrontEnd={isFrontEnd} />;

            return (
                <div className={scoreboardClass}>
					{loading}
                    {template}
                    {compactDisplay}
                </div>
            );
        }
    });


}(window, document, jQuery || jQuerySL, SCRIBBLE));