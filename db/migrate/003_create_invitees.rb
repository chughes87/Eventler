class CreateInvitees < ActiveRecord::Migration
  def change
    create_table :invitees, :id => false, :primary_key => :name do |t|
      t.string :name
      t.string :status
      t.integer :event_id
    end
  end
end