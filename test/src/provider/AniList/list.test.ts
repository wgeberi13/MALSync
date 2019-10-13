import { expect } from 'chai';
import {userlist} from './../../../../src/_provider/AniList/list';

global.con = require('./../../../../src/utils/console');
global.con.log = function() {};

var responses = {
  user: JSON.stringify(require("./api/user.json")),
  "Page1": JSON.stringify(require("./api/list-Page1.json")),
  "Page2": JSON.stringify(require("./api/list-Page2.json"))
};

function getResponse(key) {
  return responses[key];
}

global.api = {
  request: {
    xhr: async function(post, conf, data) {
      conf.data = JSON.parse(conf.data);
      if(!conf.data.variables.page) {
        return {
          responseText: getResponse('user'),
        };
      }

      if(conf.data.variables.page == 1) {
        return {
          responseText: getResponse('Page1'),
        };
      }

      return {
        responseText: getResponse('Page2'),
      };
    }
  },
  settings: {
    get: function() {
      return '';
    }
  }
}

describe('AniList userlist', function () {
  it('Get List', function () {
    var list = new userlist(7, 'anime')

    return list.get().then((list) => {
      expect(list).to.deep.include({
        uid: 112124,
        malId: 40454,
        cacheKey: 40454,
        type: 'anime',
        title:
         'Dungeon ni Deai wo Motomeru no wa Machigatteiru Darou ka III',
        url: 'https://anilist.co/anime/112124',
        watchedEp: 0,
        totalEp: 0,
        status: 6,
        score: 0,
        image:
         'https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/b112124-fY30NnaklY5W.jpg',
        tags: null,
        airingState: undefined
      });
      expect(list).to.deep.include({ uid: 9624,
         malId: 9624,
         cacheKey: 9624,
         type: 'anime',
         title: '30-sai no Hoken Taiiku',
         url: 'https://anilist.co/anime/9624',
         watchedEp: 0,
         totalEp: 12,
         status: 6,
         score: 0,
         image:
          'https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/b9624-VKt16M5xFfkG.jpg',
         tags: null,
         airingState: undefined
      });

    });

  });

  describe('Empty responses', async function () {
    Object.keys(responses).forEach(async function(index) {
      var value = responses[index];
      it( index, async function () {

        var temp = responses[index];
        responses[index] = '';
        try {
          await new userlist(7, 'anime').get();
        } catch (error) {
          responses[index] = temp;
          expect(error.code).to.equal(444)
        }

        responses[index] = temp;

      });
    });
  });

  describe('No json responses', async function () {
    Object.keys(responses).forEach(async function(index) {
      var value = responses[index];
      it( index, async function () {

        var temp = responses[index];
        responses[index] = 'This is not valid json';
        try {
          await new userlist(7, 'anime').get();
        } catch (error) {
          responses[index] = temp;
          expect(error.code).to.equal(406)
        }

        responses[index] = temp;

      });
    });
  });

});