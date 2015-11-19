(function (window, document, $, $S, undefined) {
    (function (window, document, $, Scoreboards, undefined) {
        (function (window, document, $, Templates, undefined) {

            var $L = SCRIBBLE.Scoreboards.Lang;
            var defaultState = {
				sport: null, // this must match enum from ManualScoreboard.jsx.  probably best to make global enum
				teams: {
					home: {
						fullName: $L["Home_Team_Name"],
						firstName: $L["Home"],
						nickname: $L["Home"],
						shortName: $L["Home"],
						score: '0',
						scoreDetail: [],
						logo: null
					},
					away: {
						fullName: $L["Away_Team_Name"],
						firstName: $L["Away"],
						nickname: $L["Away"],
						shortName: $L["Away"],
						score: '0',
						scoreDetail: [],
						logo: null
					}
				},
				time: "00:00",
				currentSegment: $L["First_Period"],
				notes: $L["Game_Notes"]
            };

			// this should not be changed or modified. it should be an exact copy of the initial default state
			var defaultData = JSON.parse( JSON.stringify(defaultState) );

            Templates.Base = React.createClass({

				getDefaultProps: function () {

                    return {
                        sport: {},
						data: defaultState,
						getDefaultData: function( sport ) { 
							var data = JSON.parse( JSON.stringify(defaultData) );

							if ( sport )
							{
								data.sport = sport;
							}

							return data;
						}
                    }
                },

                getInitialState: function () {

                    return {
                        isEnabled: typeof this.props.isEnabled !== "undefined" ? this.props.isEnabled : true,
                        autoUpdate: typeof this.props.autoUpdate !== "undefined" ? this.props.autoUpdate : true,
                        logoUploadingEnabled: typeof this.props.logoUploadingEnabled !== "undefined" ? this.props.logoUploadingEnabled : false,
                        allowEditing: typeof this.props.allowEditing !== "undefined" ? this.props.allowEditing : false,
                        showEditingControls: typeof this.props.showEditingControls !== "undefined" ? this.props.showEditingControls : false,
						parentNode: typeof this.props.parentNode !== "undefined" ? $(this.props.parentNode) : undefined,
                        logoUploadingRegistered: false,
                        data: this.props.data ? this.props.data : defaultState,
                        sport: typeof this.props.sport !== "undefined" ? this.props.sport : null,
                        showOvertime: this.props.showOvertime
                    };
                },

                setTeamLogo: function (teamType, url, save) {
                    var currentState = this.state;
                    if (!this.state.logoUploadingEnabled) return;

                    currentState.data.teams[teamType].logo = url;
                    this.setState(currentState);

                    if (save) {
                        this.handleUpdateClick();
                    }
                },

                componentWillReceiveProps: function (nextProps) {
                    var currentState = this.state;
                    var i;

                    if(nextProps.hasOwnProperty("data")) {
                        currentState["data"] = nextProps.data !== null ? nextProps.data : currentState.data;
                    }

                    if(nextProps.hasOwnProperty("sport") && nextProps.sport !== null && typeof nextProps.sport !== "undefined" ) {
                        
                        if(currentState.sport && nextProps.sport.key !== currentState.sport.key) {
                            currentState.sport = nextProps.sport;
                            currentState.data.sport = ( currentState.sport ? currentState.sport.key : undefined );
                        } else if(!currentState.sport && nextProps.sport) {
                            currentState.sport = nextProps.sport;
                            currentState.sport.key = nextProps.sport.key;
                        }

                        currentState.data = currentState.data || {};

                    }

                    if(nextProps.hasOwnProperty("isEnabled")) {
                        currentState.isEnabled = nextProps.isEnabled;
                    }

                    if(nextProps.hasOwnProperty("showOvertime")) {
                        currentState.showOvertime = nextProps.showOvertime;                        
                    }

                    this.setState(currentState);
                },

                componentDidUpdate: function () {
                    this.initializeLogoUploader();
                },

                initializeLogoUploader: function () {
                    var that = this;
                    var dom;
                    var logos;
                    var i;
                    var logo;

					

                    if (!this.state.isEnabled) {
						this.state.logoUploadingRegistered = false;
						return;
					}

                    if (!this.state.logoUploadingEnabled) return;
                    if (this.state.logoUploadingRegistered) return;

                    
                    dom = ( that.state.parentNode.length > 0 ? that.state.parentNode[0] : null );
                    logos = dom ? dom.getElementsByClassName("team-logo") : undefined;

                    if (!logos || logos.length === 0) return;

					this.state.logoUploadingRegistered = true;

                    for (i = 0; logo = logos[i]; i++) {
                        SCRIBBLE.Scoreboards.Service.initFileUpload(logo, {
                            invoker: that,
                            onSuccess: function (data) {
                                this.setTeamLogo(data.selector.attributes["data-team-type"].value, data.url, false);
                            },
                            onThumbnail: function (data) {
                                this.setTeamLogo(data.selector.attributes["data-team-type"].value, data.url, false);
                            }
                        });
                    }
                },

                componentDidMount: function () {

                    var currentState = this.state;
                    if (this.props.data && (!$.isEmptyObject(this.props.data))) {
                        currentState.data = this.props.data;
                    }

                    if (this.props.sport) {
                        currentState.data.sport = this.props.sport;
                    }

                    currentState.isEnabled = typeof this.props.isEnabled === 'undefined' ? currentState.isEnabled : this.props.isEnabled;

                    this.setState(currentState);
                    this.initializeLogoUploader();
                },

                handleUpdateClick: function (evt) {
                    var trigger = evt ? evt.currentTarget : undefined;
                    var promise;

                    if (trigger) {
                        SCRIBBLE.utilities.Button.SetBusy(trigger);
                    }

                    promise = SCRIBBLE.Scoreboards.Service.update(this.state.data);
                    promise.always(function () {
                        if (trigger) {
                            SCRIBBLE.utilities.Button.Restore(trigger);
                        }
                    });
                },

                updateDetails: function (data) {
                    var currentState = this.state;
                    currentState.data.teams[data.teamType][data.detailType] = data.target.value;
                    this.setState(currentState);

                    if (data.detailType === "score" && this.props.hasOwnProperty("updateScore")) {
                        this.props.updateScore(data.teamType, data.target.value);
                    }

                    if (data.detailType === "shortName" && this.props.hasOwnProperty("updateShortName")) {
                        this.props.updateShortName(data.teamType, data.target.value);
                    }

                },

                updateTime: function (data) {
                    var currentState = this.state;
                    currentState.data.time = data.target.value;
                    this.setState(currentState);
                },

                updateCurrentSegment: function (data) {
                    var currentState = this.state;
                    currentState.data.currentSegment = data.target.value;

                    this.setState(currentState);
                },

                updateNotes: function (data) {
                    var currentState = this.state;
                    currentState.data.notes = data.target.value;
                    this.setState(currentState);
                },

                removeLogoHandler: function (evt) {
                    if (!this.state.allowEditing) {
                        return;
                    }

                    if (evt.currentTarget.classList.contains("away")) {
                        this.setTeamLogo("away", null, true);
                    } else {
                        this.setTeamLogo("home", null, true);
                    }
                },

                enableEditing: function () {
                    this.setState({allowEditing: true});
                },

                updateSegmentScores: function (state) {
                    var currentState = this.state;

                    currentState.data.teams["home"].scoreDetail  = state.homeScores ;
                    currentState.data.teams["away"].scoreDetail  = state.awayScores ;
                    

                },

                disableEditing: function () {
                    var state = {allowEditing: false};
                    var hasDataInQueue = typeof this.state.newDataInQueue !== "undefined";

                    if (hasDataInQueue) {
                        state.data = this.state.newDataInQueue;
                    }

                    this.setState(state);

                    if (hasDataInQueue) {
                        this.state.hasDataInQueue = undefined;
                    }
                },

                getLogoClass: function () {
                    var logoClass = ['team-logo'];

                    if (this.props.sport && this.props.sport.key) {
                        logoClass.push(this.props.sport.key);
                    }

                    if (this.state.logoUploadingEnabled) {
                        logoClass.push('logo-uploading-enabled');
                    }

                    return logoClass.join(' ');
                },

                render: function () {
                    var that = this;
                    var awayRemoveLogo;
                    var homeRemoveLogo;
                    var actionsTemplate = undefined;
                    var isFrontEnd = (this.props.hasOwnProperty("isFrontEnd") && this.props.isFrontEnd) ? true : false;

                    var style = {
                        away: this.state.data !== null && this.state.data.teams && this.state.data.teams.away.logo !== null ? {backgroundImage: 'url(' + this.state.data.teams.away.logo + ')'} : null,
                        home: this.state.data !== null && this.state.data.teams && this.state.data.teams.home.logo !== null ? {backgroundImage: 'url(' + this.state.data.teams.home.logo + ')'} : null,
                        pointerEvents: {pointerEvents: 'none'},
                        hide: {display: 'none'}
                    };

                    if (that.state.logoUploadingEnabled) {
                        awayRemoveLogo = that.state.data && that.state.data.teams && that.state.data.teams.away.logo !== null
                            ? <span className="remove-logo away" onClick={that.removeLogoHandler}>{$L['Remove_Logo']}</span>
                            : null;
                        homeRemoveLogo = that.state.data && that.state.data.teams && that.state.data.teams.home.logo !== null
                            ? <span className="remove-logo home" onClick={that.removeLogoHandler}>{$L['Remove_Logo']}</span>
                            : null;
                    }

                    if (this.state.showEditingControls) {
                        var buttons = {
                            edit: <input type="button" className="scrbbl-msb-edit" onClick={this.enableEditing}
                                         value={SCRIBBLE.Scoreboards.Lang.Edit_Scoreboard}/>,
                            viewLive: <input type="button" className="scrbbl-msb-view-live"
                                             onClick={this.disableEditing}
                                             value={SCRIBBLE.Scoreboards.Lang.View_Live_Board}/>,
                            update: <input type="button" className="scrbbl-msb-update" onClick={this.handleUpdateClick}
                                           value={SCRIBBLE.Scoreboards.Lang.Update}/>
                        };

                        var editToggleButton = ( !this.state.allowEditing ? buttons.edit : buttons.viewLive );
                        var updateButton = ( this.state.allowEditing ? buttons.update : undefined );

                        actionsTemplate = <div className="scrbbl-msb-actions-template" style={this.props.collapsed ? style.hide : null}>
                            {editToggleButton}
                            {updateButton}
                        </div>;
                    }


                    if ( that.state.isEnabled === false || !that.props.sport) {
                        return (null);
                    }
                    else {

						var hometeamsection = 
							<div className={'team-container display-table-cell ' + (that.state.sport.homeScoresOnTop ? 'team-left' : 'team-right')}>
								<div className="display-table logo-score">
									<div className="display-table-row">
										<div className="display-table-cell team-logo-container"
												style={!that.state.allowEditing ? style.pointerEvents : null }>
											<div className={this.getLogoClass()} style={style.home}
													data-team-type="home">
												{homeRemoveLogo}
											</div>
										</div>
										<div className="display-table-cell team-score-container">
											<Templates.ContentEditable
												html={that.state.data.teams.home.score}
												allowEditing={that.state.allowEditing}
												onChange={that.updateDetails} teamType="home"
												detailType="score"/>
										</div>
									</div>
								</div>
								<div className="display-table team-name">
									<div className="display-table-row">
										<div className="display-table-cell">
											<Templates.ContentEditable
												html={that.state.data.teams.home.fullName}
												allowEditing={that.state.allowEditing}
												onChange={that.updateDetails} teamType="home"
												detailType="fullName"/>
											<Templates.ContentEditable
												html={that.state.data.teams.home.nickname}
												allowEditing={that.state.allowEditing}
												onChange={that.updateDetails} teamType="home"
												detailType="nickname"/>
										</div>
									</div>
								</div>
							</div>;


						var awayteamsection =
							<div className={'team-container display-table-cell ' + (that.state.sport.homeScoresOnTop ? 'team-right' : 'team-left')}>
								<div className="display-table logo-score">
									<div className="display-table-row">
										<div className="display-table-cell team-logo-container"
												style={!that.state.allowEditing ? style.pointerEvents : undefined }>
											<div className={this.getLogoClass()} style={style.away}
													data-team-type="away">
												{awayRemoveLogo}
											</div>
										</div>
										<div className="display-table-cell team-score-container">
											<Templates.ContentEditable
												html={that.state.data.teams.away.score}
												allowEditing={that.state.allowEditing}
												onChange={that.updateDetails} teamType="away"
												detailType="score"/>
										</div>
									</div>
								</div>
								<div className="display-table team-name">
									<div className="display-table-row">
										<div className="display-table-cell">
											<Templates.ContentEditable
												html={that.state.data.teams.away.fullName}
												allowEditing={that.state.allowEditing}
												onChange={that.updateDetails} teamType="away"
												detailType="fullName"/>
											<Templates.ContentEditable
												html={that.state.data.teams.away.nickname}
												allowEditing={that.state.allowEditing}
												onChange={that.updateDetails} teamType="away"
												detailType="nickname"/>
										</div>
									</div>
								</div>
							</div>;

						var teamsection1 = awayteamsection;
						var teamsection2 = hometeamsection;

						if (that.state.sport.homeScoresOnTop) {
							teamsection1 = hometeamsection;
							teamsection2 = awayteamsection;
						}

                        return (
                            <div>
                                <div className="manual-scoreboard-container display-table"
                                     style={this.props.collapsed ? style.hide : null}>
                                    <div className="manual-scoreboard display-table-row">
                                        {teamsection1}
                                        <div className="score-summary display-table-cell">
                                            <Scoreboards.SegmentsScores sport={that.state.sport}
                                                                    awayScores={that.state.data.teams.away.scoreDetail}
                                                                    homeScores={that.state.data.teams.home.scoreDetail}
                                                                    awayName={that.state.data.teams.away.shortName}
                                                                    homeName={that.state.data.teams.home.shortName}
                                                                    allowEditing={that.state.allowEditing}
                                                                    showOvertime={that.state.showOvertime}
                                                                    ref="segmentScores"
                                                                    isFrontEnd={isFrontEnd}
                                                                    updateSegmentScores={that.props.updateSegmentScores || this.updateSegmentScores}
                                                                    updateShortName={that.props.updateShortName}
                                                                    updateScore={that.props.updateScore} 
																	homeScoresOnTop={that.state.sport.homeScoresOnTop}/>

                                            <div className="duration">
                                                <div className="clock-time">
                                                    <Templates.ContentEditable html={that.state.data.time}
                                                                               allowEditing={that.state.allowEditing}
                                                                               onChange={that.updateTime}/>
                                                </div>
                                                <div className="segment">
                                                    <Templates.ContentEditable html={that.state.data.currentSegment}
                                                                               allowEditing={that.state.allowEditing}
                                                                               onChange={that.updateCurrentSegment}/>
                                                </div>
                                            </div>
                                        </div>
                                        {teamsection2}
                                    </div>
                                </div>
                                <div className="notes" style={this.props.collapsed ? style.hide : null}>
                                    <Templates.ContentEditable allowHtml={true} html={that.state.data.notes}
                                                               allowEditing={that.state.allowEditing}
                                                               onChange={that.updateNotes}/>
                                </div>
                                {actionsTemplate}
                            </div>
                        );

                    }
                }
            });
        }(window, document, jQuery || jQuerySL, Scoreboards.Templates || (Scoreboards.Templates = {})));
    }(window, document, jQuery || jQuerySL, $S.Scoreboards || ($S.Scoreboards = {})));
}(window, document, jQuery || jQuerySL, SCRIBBLE || (SCRIBBLE = {})));
