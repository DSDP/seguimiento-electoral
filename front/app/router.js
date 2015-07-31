import Ember from "ember";
import config from "./config/environment";

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route("login");


  this.resource('admin', function () {
    this.route("users", function() {
      this.route("new");

      this.route("edit", {
        path: ":user_id/edit"
      });

      this.route("show", {
        path: ":user_id"
      });
    });
    this.route("roles", function() {
      this.route("new");
      this.route("edit", {
        path: ":role_id/edit"
      });
    }); 

    this.route("teams", function() {
      this.route("new");
      this.route("edit", {
        path: ":team_id/edit"
      });
    }); 

    this.route("configs", function() {
      this.route("new");
      this.route("edit", {
        path: ":config_id/edit"
      });
    });              
  });

  this.resource('data-entry', function () {
    this.route("countries", function() {
      this.route("new");

      this.route("edit", {
        path: ":country_id/edit"
      });

      this.route("show", {
        path: ":country_id"
      });
    });
    this.route("provinces", function() {
      this.route("new");

      this.route("edit", {
        path: ":province_id/edit"
      });

      this.route("show", {
        path: ":province_id"
      });
    }); 
    this.route("towns", function() {
      this.route("new");

      this.route("edit", {
        path: ":town_id/edit"
      });

      this.route("show", {
        path: ":town_id"
      });
    });   
    this.route("boroughs", function() {
      this.route("new");

      this.route("edit", {
        path: ":borough_id/edit"
      });

      this.route("show", {
        path: ":borough_id"
      });
    });  
    this.route("schools", function() {
      this.route("new");

      this.route("edit", {
        path: ":school_id/edit"
      });

      this.route("show", {
        path: ":school_id"
      });
    });   
    this.route("boards", function() {
      this.route("new");

      this.route("edit", {
        path: ":board_id/edit"
      });

      this.route("show", {
        path: ":board_id"
      });
    });   
    this.route("forces", function() {
      this.route("new");

      this.route("edit", {
        path: ":force_id/edit"
      });

      this.route("show", {
        path: ":force_id"
      });
    });     
    this.route("candidates", function() {
      this.route("new");

      this.route("edit", {
        path: ":candidate_id/edit"
      });

      this.route("show", {
        path: ":candidate_id"
      });
    });    
    this.route("charges", function() {
      this.route("new");

      this.route("edit", {
        path: ":charge_id/edit"
      });

      this.route("show", {
        path: ":charge_id"
      });
    });     
    this.route("referrings", function() {
      this.route("new");

      this.route("edit", {
        path: ":referring_id/edit"
      });

      this.route("show", {
        path: ":referring_id"
      });
    });                         
  });

  this.route('team', {
    path: "team/:team_id"
  });
  this.route('config', {
    path: "config/:config_id"
  });
});

export default Router;