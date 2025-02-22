import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable, of, Subscription} from "rxjs";
import {IListsOfVideos} from "../models/listsOfVideos.interface";
import {IRequestBody} from "../models/IRequestBody";
import {IUpdateChannelDescription} from "../models/UpdateChannelDescription.interface";
import {AuthService} from "./auth.service";
import {ISearchListsOfVideos} from "../models/searchListsOfVideos.interface";
import {IVideo} from "../models/video.interface";
import {IUpdateVideoDescription} from "../models/UpdateVideoDescription.interface";
import {combineAll} from "rxjs/operators";
import {IGetVideoById} from "../models/GetVideoById.interface";

@Injectable({
  providedIn: 'root'
})
export class YoutubeService {


  private readonly  url = 'https://www.googleapis.com/youtube/v3'


  apiKey: string = 'AIzaSyBz1PwR8Q1abz_NIeQ0yg1rWNhK6Mmf9yw';

  public videos: IVideo[] = []

  public query!: string


  putRequestBody: IRequestBody = {
    id: "UCZ1YKVCERHs3LlxsRWnv_yA",
    brandingSettings: {
      channel: {
        description: "My description5",
        defaultLanguage: "en"
      }
    }
  }

  updateRequestBody: any = {
    id: "tfYipikLWDo",
    snippet: {
      categoryId: 22,
      defaultLanguage: "en",
      description: "Custom Description",
      tags: [
        "new tags"
      ],
      title: "Custom title"
    },
    localizations: {
      es: {
        title: "no hay nada a ver aqui",
        description: "Esta descripcion es en español."
      },
      ru: {
        title: "Русский текст",
        description: "Русский текст"
      }
    }
  }



  headers = new HttpHeaders()

  constructor(public http: HttpClient,
              private authService: AuthService) {}



  authenticate(): void {
    this.authService.authenticate()
  };


  refreshToken(): void {
    this.authService.refreshToken()
  }



  getVideosForChanel(channel: string, maxResults: number): Observable<IListsOfVideos> {
    let SearchUrl = this.url + '/search' + '?key=' +
      this.apiKey + '&channelId=' + channel + '&order=date&part=snippet &type=video,id&maxResults=' + maxResults

    return this.http.get<IListsOfVideos>(SearchUrl)

  }


  getVideosForRequest(maxResults: number): Observable<ISearchListsOfVideos> {

    let SearchUrl = this.url + '/search' + '?part=id&part=snippet&maxResults='+ maxResults + '&q='+ this.query +'&key=' + this.apiKey

    return this.http.get<ISearchListsOfVideos>(SearchUrl)
  }

  getVideoById(videoId: string): Observable<IGetVideoById> {
    let SearchUrl = this.url + '/videos' + '?part=snippet%2Clocalizations' + '&id=' + videoId + '&key=' + this.apiKey

    return this.http.get<IGetVideoById>(SearchUrl)

  }


  setHeaders(): HttpHeaders {

    return this.headers
      .set('Authorization', 'Bearer ' + this.authService.access_token)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')

  }


  updateChannelDescription(newDescription: string, newDefaultLanguage: string): Observable<IUpdateChannelDescription> {

    let updateChannelDescriptionUrl = this.url + '/search' + '?key=' + '?part=brandingSettings'

    this.putRequestBody.brandingSettings.channel.description = newDescription
    this.putRequestBody.brandingSettings.channel.defaultLanguage = newDefaultLanguage

    const headers = this.setHeaders()

    return this.http.put<IUpdateChannelDescription>(updateChannelDescriptionUrl, this.putRequestBody, {headers})

  }


  updateVideoDescription(newVideoDescription: string, newVideoTitle: string,
                         newRusTitle: string, newRusDescription: string, videoId: string): Observable<IUpdateVideoDescription> {
    let updateVideoDescriptionUrl = this.url + '/videos' + '?part=snippet%2Clocalizations'
    this.updateRequestBody.id = videoId
    this.updateRequestBody.snippet.title = newVideoTitle
    this.updateRequestBody.snippet.description = newVideoDescription
    this.updateRequestBody.localizations.ru.title = newRusTitle
    this.updateRequestBody.localizations.ru.description =newRusDescription

    const headers = this.setHeaders()

    return this.http.put<IUpdateVideoDescription>(updateVideoDescriptionUrl, this.updateRequestBody, {headers})

  }

}
