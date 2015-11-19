//-- AT Internet JWRM  2.0.001 -- Copyright 2012 AT Internet, All Rights Reserved.
//-- (to be used with AT Internet Tag 3.4.002 or later)

function xtIdxOf2_v2(tab, v, n) {
    n = (n == null) ? 0 : n;
    var m = tab.length;
    for (var i = n; i < m; i++)
        if (tab[i] == v) return i;
    return -1
}

function xtHitjw_v2(player, playlist, states) {
    var idx = xtIdxOf2_v2(xtIdPlayer, player.id);
    var playListItem = xtPlaylist[player.id][xtIdxPlaylist[idx]];
    var xtaction = null,
        xtcfg = player.config,
        xttype = playListItem.type,
        xtn2 = playListItem.xtn2,
        xtrichname = playListItem.richname,
        xtclink = playListItem.clink,
        xtcustom = playListItem.custom,
        xtrefresh = playListItem.refresh,
        xtduration = playListItem.duration,
        xtquality = playListItem.quality,
        xtstream = playListItem.stream,
        xtlocation = playListItem.location,
        xtmode = playListItem.mode,
        xtsize = playListItem.size,
        xtextension = playListItem.extension;
    if (xtcfg) {
        xtplayer = xtcfg['xtplayer']
    } else {
        var o_html = document.getElementById(player.id);
        if (o_html) xtplayer = o_html.getAttribute('xtplayer')
    } if (states.oldstate) {
        switch (states.newstate.toLowerCase() + states.oldstate.toLowerCase()) {
        case 'bufferingidle':
            {
                xtaction = 'play';
                xtBuf[idx] = 1;
                break
            }
        case 'playingidle':
            {
                xtaction = 'play';
                xtBuf[idx] = 0;
                break
            }
        case 'playingbuffering':
            {
                xtaction = 'info';
                xtBuf[idx] = 0;
                break
            }
        case 'bufferingplaying':
            {
                xtaction = 'info';
                xtBuf[idx] = 1;
                break
            }
        case 'bufferingpaused':
            {
                xtaction = 'play';
                xtBuf[idx] = 1;
                break
            }
        case 'pausedplaying':
            {
                xtaction = 'pause';
                xtBuf[idx] = 0;
                break
            }
        case 'pausedbuffering':
            {
                xtaction = 'pause';
                xtBuf[idx] = 0;
                break
            }
        case 'playingpaused':
            {
                xtaction = 'play';
                xtBuf[idx] = 0;
                break
            }
        case 'idleplaying':
            {
                xtaction = 'stop';
                xtBuf[idx] = 0;
                break
            }
        case 'idlepaused':
            {
                xtaction = 'stop';
                xtBuf[idx] = 0;
                break
            }
        case 'idlebuffering':
            {
                xtaction = 'stop';
                xtBuf[idx] = 0;
                break
            }
        default:
            {
                break
            }
        }
    }
    xtRmp[idx] = Math.round(player.getPosition());
    xtRmbufp[idx] = Math.round((player.getBuffer() / 100) * xtduration);
    if (states.offset) {
        xtaction = 'move';
        xtRmpf[idx] = xtRmp[idx];
        xtRmp[idx] = Math.round(states.offset)
    }
    if (xtaction != null) {
        xttype += xtplayer ? '&plyr=' + xtplayer : '';
        xtrichname += xtclink ? '&clnk=' + xtclink : '';
        xtaction += (xtBuf[idx] != '0') ? '&buf=' + xtBuf[idx] : '';
        xtRmp[idx] = (xtRmp[idx] < 0) ? 0 : xtRmp[idx];
        xtRmp[idx] = (xtRmp[idx] > xtduration) ? xtduration : xtRmp[idx];
        xtRmbufp[idx] = isNaN(xtRmbufp[idx]) ? 0 : xtRmbufp[idx];
        xtRmbufp[idx] = (xtRmbufp[idx] > xtduration) ? xtduration : xtRmbufp[idx];
        var xtrmp = 'rmp=' + xtRmp[idx] + '&rmpf=' + xtRmpf[idx] + '&rmbufp=' + xtRmbufp[idx];
        xtcustom = (xtcustom) ? 'custom=' + xtcustom : '';
        xt_rm(xttype, xtn2, xtrichname, xtaction, xtcustom, xtrefresh, xtduration, xtrmp, xtquality, xtstream, xtlocation, xtmode, xtsize, xtextension)
    }
}

function xtjw_init(player, playlist) {
    var idplayer = player.id;
    if (typeof xtPlaylist != 'undefined' && typeof xtPlaylist[idplayer] != 'undefined') {
        if (typeof xtIdPlayer == "undefined") {
            xtIdPlayer = new Array;
            xtRmp = new Array;
            xtRmpf = new Array;
            xtRmbufp = new Array;
            xtBuf = new Array;
            xtIdxPlaylist = new Array
        }
        if ((xtIdxOf2_v2(xtIdPlayer, idplayer)) == -1) {
            xtIdPlayer.push(idplayer);
            xtRmp.push(0);
            xtRmpf.push(0);
            xtRmbufp.push(0);
            xtBuf.push(0);
            xtIdxPlaylist.push(0)
        }
        var idx = xtIdxOf2_v2(xtIdPlayer, idplayer);
        player.onPlay(function (states) {
            xtHitjw_v2(jwplayer(xtIdPlayer[idx]), playlist, states)
        });
        player.onPause(function (states) {
            xtHitjw_v2(jwplayer(xtIdPlayer[idx]), playlist, states)
        });
        player.onBuffer(function (states) {
            xtHitjw_v2(jwplayer(xtIdPlayer[idx]), playlist, states)
        });
        player.onIdle(function (states) {
            xtHitjw_v2(jwplayer(xtIdPlayer[idx]), playlist, states)
        });
        if (typeof player.onSeek == 'function') {
            player.onSeek(function (states) {
                if ((Math.round((player.getBuffer() / 100) * player.getDuration())) > Math.round(states.offset)) {
                    xtHitjw_v2(jwplayer(xtIdPlayer[idx]), playlist, states)
                }
            })
        }
        player.onPlaylistItem(function (e) {
            xtIdxPlaylist[xtIdxOf2_v2(xtIdPlayer, player.id)] = e.index
        })
    }
}

