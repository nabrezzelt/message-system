//Load all Conversations include TabContainer
AJAXCode = 
{
    OK : 0,
    FAILED : 1
}

window.setInterval(function(){
    var myID = $(".user-data").data('id');

    //Do Sutuff for current open tab
    var currentConversationID = $("li.active a[data-toggle='tab']").data("conversation-id"); 
    var createTime = $("#conversation-" + currentConversationID + " .chat-container .other-message:last .message-data-other").text();

    $.get("ajax.php?act=get-messages-after&conversation-id=" + currentConversationID + "&after=" + createTime, function (data) {
        console.log(data);
        for (var i = 0; i < data.length; i++) 
        {
            var message = data[i];
            console.log(message);   //Object { id: "91", message: "peter", user: Object, createTime: "2017-02-10 10:08:10" }

            //$("#conversation-" + currentConversationID + " .chat-container").append("<div class='other-message'>" + message.message + "<div class='message-data-other text-right text-muted'><span class='glyphicon glyphicon-time'></span> 2017-02-10 10:05:26</div></div>") 
        }
        messages = formatMessages(data, myID);
        console.log(messages);
        $("#conversation-" + currentConversationID + " .chat-container").append(messages);

        if(messages != "")
        {
            $("#conversation-" + currentConversationID + " .chat-container").animate({
                scrollTop: $("#conversation-" + currentConversationID + " .chat-container")[0].scrollHeight },
                1000
            ); 
        }   
                                      
    }, 'json');
    
 

    //Do stuff for all other Tabs where not active
    $(".nav-tabs > li").each(function() {
        if(!$(this).hasClass("active"))
        {
            var conversationID = $(this).children('a').data("conversation-id");
            var createTime = $("#conversation-" + conversationID + " .chat-container .other-message:last .message-data-other").text();

            var url = "ajax.php?act=has-new-messages&conversation-id=" + conversationID + "&after=" + createTime;
            //console.log(url);
            $.get(url, function (data) {
                console.log(data);
                if(data.newMessages > 0)
                {
                    $("a[data-conversation-id='" + data.conversationID + "'] .message-count").html("<span class='badge'>" + data.newMessages + "</span>");                    
                }
            }, 'json');
        }
    });
    

    console.log("Check for new Messages");
}, 3000);


//Function do stuff on click on tab
$(document).on('click', "a[data-toggle='tab']", function() {
    console.log("tab changed");
    var conversationID = $(this).data('conversation-id');
    $("a[data-conversation-id='" + conversationID + "'] .message-count").html(""); 

    //Load Messages Directly
    var myID = $(".user-data").data('id');

    //Do Sutuff for current open tab
    var currentConversationID = $("li.active a[data-toggle='tab']").data("conversation-id"); 
    var createTime = $("#conversation-" + currentConversationID + " .chat-container .other-message:last .message-data-other").text();

    $.get("ajax.php?act=get-messages-after&conversation-id=" + currentConversationID + "&after=" + createTime, function (data) {
        console.log(data);
        for (var i = 0; i < data.length; i++) 
        {
            var message = data[i];
            console.log(message);   //Object { id: "91", message: "peter", user: Object, createTime: "2017-02-10 10:08:10" }

            //$("#conversation-" + currentConversationID + " .chat-container").append("<div class='other-message'>" + message.message + "<div class='message-data-other text-right text-muted'><span class='glyphicon glyphicon-time'></span> 2017-02-10 10:05:26</div></div>") 
        }
        messages = formatMessages(data, myID);
        console.log(messages);
        $("#conversation-" + currentConversationID + " .chat-container").append(messages);

        if(messages != "")
        {
            $("#conversation-" + currentConversationID + " .chat-container").animate({
                scrollTop: $("#conversation-" + currentConversationID + " .chat-container")[0].scrollHeight },
                1000
            ); 
        }   
                                      
    }, 'json');
});

$(document).on('keydown', 'textarea[data-conversation-id]', function (e){
    if(e.keyCode == 13 && e.shiftKey)
    {
        
    }
    else if(e.keyCode == 13)
    {
        var conversationID = $(this).data("conversation-id");
        $("button[data-conversation-id='" + conversationID + "']").trigger('click');
    }
});

$(document).ready(function() {     
    var myID = $(".user-data").data('id');        

    $.get("ajax.php?act=all-conversations", function (data) {        
        for (var i = 0; i < data.length; i++) {
            var conversation = data[i];
            console.log(conversation);
           
            $('.nav-tabs').append("<li " + ((i == 0) ? "class='active'": '') + "><a data-toggle='tab' data-conversation-id='" + conversation.id + "' href='#conversation-" + conversation.id + "'>" + ((conversation.userA.id == myID) ? conversation.userB.username : conversation.userA.username) + " <span class='message-count'></span></a></li>");
                              

            if(i == 0)
            {                
                $('.tab-content').html("<div id='conversation-" + conversation.id + "' class='tab-pane fade in active'>" +
                                            "<div class='chat-container col-sm-10'>" +
                                                formatMessages(conversation.messages, myID) + 
                                            "</div>" +
                                            "<div class='textbox-container'>" +
                                                "<div class='form-group col-sm-10'>" +
                                                    "<div class='row'>" +                                                            
                                                        "<div><textarea data-conversation-id='" + conversation.id + "' class='form-control message-textbox col-sm-8' rows='3' placeholder='Your Message'></textarea></div>" +
                                                    "</div>" +
                                                "</div>" +
                                                "<div class='col-sm-10 text-right'>" +
                                                "<button data-conversation-id='" + conversation.id + "' class='btn-send btn btn-primary disabled' type='submit'>Send</button>" +
                                                "</div>" +
                                            "</div>" +
                                        "</div>");
            }
            else
            {
                $('.tab-content').append("<div id='conversation-" + conversation.id + "' class='tab-pane fade in'>" +
                                            "<div class='chat-container col-sm-10'>" +
                                                formatMessages(conversation.messages, myID) + 
                                            "</div>" +
                                            "<div class='textbox-container'>" +                                                
                                                "<div class='form-group col-sm-10'>" +
                                                    "<div class='row'>" +                                                           
                                                        "<div><textarea data-conversation-id='" + conversation.id + "' class='form-control message-textbox col-sm-8' rows='3' placeholder='Your Message'></textarea></div>" +
                                                    "</div>" +
                                                "</div>" +
                                                "<div class='col-sm-10 text-right'>" +
                                                "<button data-conversation-id='" + conversation.id + "' class='btn-send btn btn-primary disabled' type='submit'>Send</button>" +
                                                "</div>" +                                               
                                            "</div>" +
                                        "</div>");                
            }
        }
    }, 'json');    
});

$(document).on('click', '.btn-send', function() {
    if($(this).hasClass('disabled'))
    {
        console.log("no Text to Send");        
        return;
    }

    var conversationID = $(this).data('conversation-id');
    var msg = $("textarea[data-conversation-id='" + conversationID + "']").val();
    console.log(msg);

    $.ajax({
        type: "POST",
        url: "ajax.php?act=send-message&conversation-id=" + conversationID,
        data: {content: msg},
        success: function(data) {
            if(data.AJAXCode == AJAXCode.OK)
            {
                console.log(data);

                $("#conversation-" + conversationID + " .chat-container").append("<div class='my-message'>" + formatLinksAndEmots(msg) + "<div class='message-data text-right text-muted'><span class='glyphicon glyphicon-time'></span> " + getCurrentDate() + "</div></div>");

                $("textarea[data-conversation-id='" + conversationID + "']").val("");
                $("button[data-conversation-id='" + conversationID + "']").addClass('disabled');

                $("#conversation-" + conversationID + " .chat-container").animate({
                    scrollTop: $("#conversation-" + conversationID + " .chat-container")[0].scrollHeight},
                    1000
                );                
            }
        },
        dataType: 'json'
    });
});


$(document).on('input', '[data-conversation-id]', function() {        
    var conversationID = $(this).data('conversation-id');

    if($(this).val() != "")
    {
        $("*[data-conversation-id='" + conversationID + "']").removeClass('disabled');
    }
    else
    {
        $("*[data-conversation-id='" + conversationID + "']").addClass('disabled');
    }
});

function formatMessages(messageData, myID)
{    
    var messages = "";
    for (var j = 0; j < messageData.length; j++) 
    {
        var message = messageData[j]; 
        console.log(message.content);
        
        if(message.user.id == myID)
        {
            messages += ("<div class='my-message'>" + formatLinksAndEmots(message.content) + "<div class='message-data text-right text-muted'><span class='glyphicon glyphicon-time'></span> " + message.createTime + "</div></div>");                          
        } 
        else
        {
            messages += ("<div class='other-message'>" + formatLinksAndEmots(message.content) + "<div class='message-data-other text-right text-muted'><span class='glyphicon glyphicon-time'></span> " + message.createTime + "</div></div>"); 
        }                                                                
    }        
    return messages;
}


function getCurrentDate()
{
    var d = new Date();
    var curr_date = d.getDate();
    var curr_month = d.getMonth() + 1; //Months are zero based
    var curr_year = d.getFullYear();
    var curr_hour = d.getHours();
    var curr_min = d.getMinutes();
    var curr_sec = d.getSeconds();
    return curr_year + "-" + ((curr_month < 10) ? '0' : '') + curr_month + "-" + ((curr_date < 10) ? '0' : '') + curr_date + " " + ((curr_hour < 10) ? '0' : '') + curr_hour + ":" + curr_min + ":" + ((curr_sec < 10) ? '0' : '') + curr_sec;
}


function formatLinksAndEmots(message)
{
    //Alle \n's mit <br> replacen
    message = message.replace('\n', '<br />');

    var ImgExpr  = /((?:(?:https?:\/\/))[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b(?:[-a-zA-Z0-9@:%_\+.~#?&\/=]*(\.jpg|\.png|\.jpeg|\.gif)))/g;
    var YTExpr   = /(((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)([^'\s])?)/g;
    var LinkExpr = /(['])?([(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b[-a-zA-Z0-9@:%_\+.~#?&//=]*)(['])?/g
    // var LinkExpr = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;

    message = message.replace(ImgExpr, "<img class='img-responsive' src='$1'/>");

    var ytMatches = YTExpr.exec(message); 
    try 
    {
        var ytURL = ytMatches[0];
        message = message.replace(ytURL, YouTubeUrlNormalize(ytURL));
        message = message.replace(YTExpr, "<div class='embed-responsive embed-responsive-16by9'><iframe class='embed-responsive-item' src='$1' allowfullscreen></iframe></div>");
    }
    catch (error) { }   
    
    var found = message.match(LinkExpr);
    console.log(found);
    try {
        for (var i = 0; i < found.length; i++) {
            var link = found[i];
            console.log(link);
            if(!link.startsWith("'") && !link.endsWith("'"))
            {
                
                message = message.replace(message, "<a href='" + link + "'>" + link + "</a>");

            }            
        }
    } catch (error) {
        
    }

    return message;
}


var getVidId = function(url)
{
    var vidId;
    if(url.indexOf("youtube.com/watch?v=") !== -1)//https://m.youtube.com/watch?v=e3S9KINoH2M
    {
        vidId = url.substr(url.indexOf("youtube.com/watch?v=") + 20);
    }
    else if(url.indexOf("youtube.com/watch/?v=") !== -1)//https://m.youtube.com/watch/?v=e3S9KINoH2M
    {
        vidId = url.substr(url.indexOf("youtube.com/watch/?v=") + 21);
    }
    else if(url.indexOf("youtu.be") !== -1)
    {
        vidId = url.substr(url.indexOf("youtu.be") + 9);
    }
    else if(url.indexOf("www.youtube.com/embed/") !== -1)
    {
        vidId = url.substr(url.indexOf("www.youtube.com/embed/") + 22);
    }
    else if(url.indexOf("?v=") !== -1)// http://m.youtube.com/?v=tbBTNCfe1Bc
    {
        vidId = url.substr(url.indexOf("?v=")+3, 11);
    }
    else
    {
        console.warn("YouTubeUrlNormalize getVidId not a youTube Video: "+url);
        vidId = null;
    }

    if(vidId.indexOf("&") !== -1)
    {
        vidId = vidId.substr(0, vidId.indexOf("&") );
    }
    return vidId;
};

var YouTubeUrlNormalize = function(url)
{
    var rtn = url;
    if(url)
    {
        var vidId = getVidId(url);
        if(vidId)
        {
            rtn = "https://www.youtube.com/embed/"+vidId;
        }
        else
        {
            rtn = url;
        }
    }

    return rtn;
};

YouTubeUrlNormalize.getThumbnail = function(url, num)
{
    var rtn, vidId = getVidId(url);
    if(vidId)
    {
        if(!isNaN(num) && num <= 4 && num >= 0)
        {
            rtn = "http://img.youtube.com/vi/"+vidId+"/"+num+".jpg";
        }
        else
        {
            rtn = "http://img.youtube.com/vi/"+getVidId(url)+"/default.jpg";
        }
    }
    else
    {
        return null;
    }
    return rtn;
};

YouTubeUrlNormalize.getFullImage = function(url)
{
    var vidId = getVidId(url);
    if(vidId)
    {
        return "http://img.youtube.com/vi/"+vidId+"/0.jpg";
    }
    else
    {
        return null;
    }
};

if ( typeof exports !== "undefined" ) {
    module.exports = YouTubeUrlNormalize;
}
else if ( typeof define === "function" ) {
    define( function () {
        return YouTubeUrlNormalize;
    } );
}
else {
    window.YouTubeUrlNormalize = YouTubeUrlNormalize;
}