import pandas as pd
import os
def index():
    #get_data()
    return dict()


def get_data():
    
    df = pd.read_csv(os.path.join(request.folder, 'private', 'data/dataset_1/Video_Games_Sales_as_at_22_Dec_2016.csv'));

    print df

    master = createDataRow(df)

    output = '{"averages":{"master":'+master

    genres = df['Genre'].dropna().unique()

    print genres

    for g in genres:
        output+=',"'+g+'":'+createDataRow(df[df['Genre']==g])

    output+='},"years":{'


    years = df['Year_of_Release'].dropna().unique()
    print years
    yIndex = 0
    for y in years:
        if yIndex > 0:
            output+=","
        output+='"'+str(y)+'":'+createDataRow(df[df['Year_of_Release']==y])
        yIndex+=1
    output+="} }"

    print output
    return output

    # output = {}
    # output['eu'] = df['EU_Sales'].mean()
    # output['jp'] = df['JP_Sales'].mean()
    # output['na'] = df['NA_Sales'].mean()
    # output['o'] = df['Other_Sales'].mean()
    # output['g'] = df['Global_Sales'].mean()

    # print output

    # jsontring = '{'
    # ndx = 0
    # for o in output:
    #     if ndx > 0:
    #         jsontring+=','
    #     jsontring+='"'+o+'":'+str(output[o])
    #     ndx+=1
    # #print 'hello'
    # jsontring+='}'
    # return jsontring


def createDataRow(df):
    output = {}
    output['Europe'] = df['EU_Sales'].sum()
    output['Japan'] = df['JP_Sales'].sum()
    output['North America'] = df['NA_Sales'].sum()
    output['Other'] = df['Other_Sales'].sum()
    output['TOTAL'] = df['Global_Sales'].sum()

    #print output

    jsontring = '{'
    ndx = 0
    for o in output:
        if ndx > 0:
            jsontring+=','
        jsontring+='"'+o+'":'+str(output[o])
        ndx+=1
    #print 'hello'
    jsontring+='}'
    return jsontring

def user():
    """
    exposes:
    http://..../[app]/default/user/login
    http://..../[app]/default/user/logout
    http://..../[app]/default/user/register
    http://..../[app]/default/user/profile
    http://..../[app]/default/user/retrieve_password
    http://..../[app]/default/user/change_password
    http://..../[app]/default/user/bulk_register
    use @auth.requires_login()
        @auth.requires_membership('group name')
        @auth.requires_permission('read','table name',record_id)
    to decorate functions that need access control
    also notice there is http://..../[app]/appadmin/manage/auth to allow administrator to manage users
    """
    return dict(form=auth())


@cache.action()
def download():
    """
    allows downloading of uploaded files
    http://..../[app]/default/download/[filename]
    """
    return response.download(request, db)


def call():
    """
    exposes services. for example:
    http://..../[app]/default/call/jsonrpc
    decorate with @services.jsonrpc the functions to expose
    supports xml, json, xmlrpc, jsonrpc, amfrpc, rss, csv
    """
    return service()


